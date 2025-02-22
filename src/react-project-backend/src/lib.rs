use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static NFTS: RefCell<HashMap<Nat, NFT>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct NFT {
    id: Nat,
    owner: String,
    metadata: String,
}

#[ic_cdk::query]
fn get_nft(id: Nat) -> Option<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow().get(&id).cloned()
    })
}

#[ic_cdk::update]
fn mint_nft(owner: String, metadata: String) -> Nat {
    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        let new_id = Nat::from(nfts.len() + 1);
        nfts.insert(new_id.clone(), NFT { 
            id: new_id.clone(), 
            owner, 
            metadata 
        });
        new_id
    })
}

#[ic_cdk::update]
fn transfer_nft(id: Nat, new_owner: String) -> bool {
    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        if let Some(nft) = nfts.get_mut(&id) {
            nft.owner = new_owner;
            return true;
        }
        false
    })
}

#[ic_cdk::init]
fn init() {
    NFTS.with(|nfts| {
        *nfts.borrow_mut() = HashMap::new();
    });
}

#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    NFTS.with(|nfts| {
        let nfts_vec: Vec<(Nat, NFT)> = nfts.borrow()
            .iter()
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect();
        ic_cdk::storage::stable_save((nfts_vec,)).expect("Failed to save state");
    });
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (nfts_vec,): (Vec<(Nat, NFT)>,) = ic_cdk::storage::stable_restore().expect("Failed to restore state");
    let mut nfts_map = HashMap::new();
    for (k, v) in nfts_vec {
        nfts_map.insert(k, v);
    }
    
    NFTS.with(|nfts_ref| {
        *nfts_ref.borrow_mut() = nfts_map;
    });
}