#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency},
    };
    use frame_system::pallet_prelude::*;
    use sp_std::vec::Vec;

    type BalanceOf<T> = <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
    type BlockNumberFor<T> = <T as frame_system::Config>::BlockNumber;

    #[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    pub enum Vote {
        For,
        Against,
    }

    #[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    pub struct Proposal<AccountId, BlockNumber> {
        id: u32,
        title: BoundedVec<u8, ConstU32<100>>,
        description: BoundedVec<u8, ConstU32<500>>,
        creator: AccountId,
        expiry: BlockNumber,
        votes_for: u32,
        votes_against: u32,
        executed: bool,
    }

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;

        #[pallet::constant]
        type ProposalDuration: Get<BlockNumberFor<Self>>; // Number of blocks before a proposal expires
    }

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    #[pallet::getter(fn proposals)]
    pub type Proposals<T: Config> =
        StorageMap<_, Blake2_128Concat, u32, Proposal<T::AccountId, BlockNumberFor<T>>, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_proposal_id)]
    pub type NextProposalId<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn votes)]
    pub type Votes<T: Config> =
        StorageMap<_, Blake2_128Concat, (u32, T::AccountId), Vote, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn delegated_votes)]
    pub type DelegatedVotes<T: Config> =
        StorageMap<_, Blake2_128Concat, T::AccountId, T::AccountId, OptionQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        ProposalCreated(u32, T::AccountId),
        Voted(T::AccountId, u32, Vote),
        ProposalPassed(u32),
        ProposalFailed(u32),
        VoteDelegated(T::AccountId, T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        ProposalNotFound,
        AlreadyVoted,
        ProposalExpired,
        Unauthorized,
        CannotDelegateToSelf,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn create_proposal(
            origin: OriginFor<T>,
            title: Vec<u8>,
            description: Vec<u8>,
        ) -> DispatchResult {
            let creator = ensure_signed(origin)?;
            let proposal_id = NextProposalId::<T>::get();

            let bounded_title: BoundedVec<u8, ConstU32<100>> = title.try_into().map_err(|_| Error::<T>::ProposalNotFound)?;
            let bounded_description: BoundedVec<u8, ConstU32<500>> = description.try_into().map_err(|_| Error::<T>::ProposalNotFound)?;

            let proposal = Proposal {
                id: proposal_id,
                title: bounded_title,
                description: bounded_description,
                creator: creator.clone(),
                expiry: frame_system::Pallet::<T>::block_number() + T::ProposalDuration::get(),
                votes_for: 0,
                votes_against: 0,
                executed: false,
            };

            Proposals::<T>::insert(proposal_id, proposal);
            NextProposalId::<T>::put(proposal_id + 1);
            Self::deposit_event(Event::ProposalCreated(proposal_id, creator));

            Ok(())
        }

        #[pallet::weight(10_000)]
        pub fn vote(origin: OriginFor<T>, proposal_id: u32, vote: Vote) -> DispatchResult {
            let voter = ensure_signed(origin)?;

            Proposals::<T>::try_mutate(proposal_id, |maybe_proposal| {
                let proposal = maybe_proposal.as_mut().ok_or(Error::<T>::ProposalNotFound)?;

                ensure!(
                    frame_system::Pallet::<T>::block_number() < proposal.expiry,
                    Error::<T>::ProposalExpired
                );

                ensure!(
                    !Votes::<T>::contains_key((proposal_id, voter.clone())),
                    Error::<T>::AlreadyVoted
                );

                match vote {
                    Vote::For => proposal.votes_for += 1,
                    Vote::Against => proposal.votes_against += 1,
                }

                Votes::<T>::insert((proposal_id, voter.clone()), vote);
                Self::deposit_event(Event::Voted(voter, proposal_id, vote));

                Ok(())
            })
        }

        #[pallet::weight(10_000)]
        pub fn delegate_vote(origin: OriginFor<T>, to: T::AccountId) -> DispatchResult {
            let delegator = ensure_signed(origin)?;

            ensure!(delegator != to, Error::<T>::CannotDelegateToSelf);
            DelegatedVotes::<T>::insert(delegator.clone(), to.clone());

            Self::deposit_event(Event::VoteDelegated(delegator, to));

            Ok(())
        }

        #[pallet::weight(10_000)]
        pub fn finalize_proposal(origin: OriginFor<T>, proposal_id: u32) -> DispatchResult {
            ensure_root(origin)?;

            Proposals::<T>::try_mutate(proposal_id, |maybe_proposal| {
                let proposal = maybe_proposal.as_mut().ok_or(Error::<T>::ProposalNotFound)?;

                ensure!(
                    frame_system::Pallet::<T>::block_number() >= proposal.expiry,
                    Error::<T>::ProposalExpired
                );

                let total_votes = proposal.votes_for + proposal.votes_against;
                let passed = proposal.votes_for > total_votes / 2;

                proposal.executed = true;

                if passed {
                    Self::deposit_event(Event::ProposalPassed(proposal_id));
                } else {
                    Self::deposit_event(Event::ProposalFailed(proposal_id));
                }

                Ok(())
            })
        }
    }
}
