use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static NFTS: RefCell<HashMap<u64, NFT>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct NFTMetadata {
    title: String,
    description: String,
    price: String,
    category: String,
    location: String,
    contact_info: String,
    // additional_details: String,
    file_name: String,
    file_size: u64,
    upload_timestamp: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct NFT {
    id: u64,
    owner: String,
    metadata: NFTMetadata,
    created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize)]
struct MintRequest {
    owner: String,
    metadata: NFTMetadata,
}

#[ic_cdk::query]
fn get_nft(id: u64) -> Option<NFT> {
    NFTS.with(|nfts| nfts.borrow().get(&id).cloned())
}

#[ic_cdk::query]
fn get_user_nfts(owner: String) -> Vec<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow()
            .values()
            .filter(|nft| nft.owner == owner)
            .cloned()
            .collect()
    })
}

#[ic_cdk::query]
fn search_nfts(search_term: String) -> Vec<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow()
            .values()
            .filter(|nft| {
                nft.metadata
                    .title
                    .to_lowercase()
                    .contains(&search_term.to_lowercase())
                    || nft
                        .metadata
                        .description
                        .to_lowercase()
                        .contains(&search_term.to_lowercase())
                    || nft
                        .metadata
                        .category
                        .to_lowercase()
                        .contains(&search_term.to_lowercase())
                    || nft
                        .metadata
                        .location
                        .to_lowercase()
                        .contains(&search_term.to_lowercase())
            })
            .cloned()
            .collect()
    })
}

#[ic_cdk::update]
fn mint_nft(request: MintRequest) -> u64 {
    let timestamp = ic_cdk::api::time();

    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        let new_id = (nfts.len() as u64) + 1;

        nfts.insert(
            new_id,
            NFT {
                id: new_id,
                owner: request.owner,
                metadata: request.metadata,
                created_at: timestamp,
            },
        );

        new_id
    })
}

#[ic_cdk::update]
fn transfer_nft(id: u64, new_owner: String) -> bool {
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
        let nfts_vec: Vec<(u64, NFT)> =
            nfts.borrow().iter().map(|(k, v)| (*k, v.clone())).collect();
        ic_cdk::storage::stable_save((nfts_vec,)).expect("Failed to save state");
    });
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let (nfts_vec,): (Vec<(u64, NFT)>,) =
        ic_cdk::storage::stable_restore().expect("Failed to restore state");
    let mut nfts_map = HashMap::new();
    for (k, v) in nfts_vec {
        nfts_map.insert(k, v);
    }

    NFTS.with(|nfts_ref| {
        *nfts_ref.borrow_mut() = nfts_map;
    });
}
