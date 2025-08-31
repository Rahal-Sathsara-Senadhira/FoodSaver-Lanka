public type DonorOrder record {
    int id;
    string donor_id;
    string donor_restaurant;
    string donated_item;
    string donated_amount;
    string? delivered_person;
};
