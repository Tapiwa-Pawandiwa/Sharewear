drop view if exists "public"."donation_with_details";

create or replace view "public"."donation_requests_with_categories_and_tags" as  SELECT "donationRequest".id AS donation_request_id,
    "donationRequest".created_at AS time_added,
    "donationRequest".headline,
    "donationRequest".description,
    "donationRequest".status,
    "donationRequest".latitude,
    "donationRequest".longitude,
    "donationRequest".formatted_address,
    "donationRequest".main_location,
    "donationRequest".secondary_location,
    "donationRequest".images,
    "donationRequest"."beneficiary_ID",
    array_agg(DISTINCT category.name) AS category_names,
    array_agg(DISTINCT item.name) AS item_names,
    array_agg(DISTINCT tags.name) AS tag_names
   FROM (((("donationRequest"
     JOIN item ON (("donationRequest".id = item."donationRequest_ID")))
     JOIN category ON ((item."category_ID" = category.id)))
     LEFT JOIN donation_request_tags ON (("donationRequest".id = donation_request_tags."donationRequest_ID")))
     LEFT JOIN tags ON ((tags.id = donation_request_tags."tag_ID")))
  GROUP BY "donationRequest".id, "donationRequest"."beneficiary_ID";


create or replace view "public"."donation_with_details" as  SELECT donation.id AS donation_id,
    donation.created_at AS time_added,
    donation.status AS donation_status,
    donation."donor_ID",
    donation."beneficiary_ID",
    "donationRequest".headline AS donation_request_headline,
    "donationRequest".id AS "donationRequest_ID",
    "donationRequest".images,
    "donationRequest".formatted_address AS donation_request_address,
    item.name AS item_name,
    item.status AS item_status,
    item.id AS item_id,
    donation_timers.expiration_time,
    donation_timers.timer_start_time,
    donation_timers.timer_canceled,
    profiles.first_name,
    profiles.last_name,
    profiles.phone_number
   FROM (((((donation
     JOIN "donationRequest" ON ((donation."donationRequest_ID" = "donationRequest".id)))
     JOIN donation_timers ON ((donation.id = donation_timers.donation_id)))
     JOIN donation_items ON ((donation.id = donation_items."donation_ID")))
     JOIN item ON ((donation_items."item_ID" = item.id)))
     JOIN profiles ON ((donation."donor_ID" = profiles.id)));



