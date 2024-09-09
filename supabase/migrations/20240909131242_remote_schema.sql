drop view if exists "public"."donation_with_details";

create or replace view "public"."donation_with_details" as  SELECT donation.id AS donation_id,
    donation.created_at AS time_added,
    donation.status AS donation_status,
    donation."donor_ID",
    donation."beneficiary_ID",
    "donationRequest".headline AS donation_request_headline,
    "donationRequest".id AS "donationRequest_ID",
    "donationRequest".images,
    "donationRequest".formatted_address AS donation_request_address,
    array_agg(item.id) AS item_ids,
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
     JOIN profiles ON ((donation."donor_ID" = profiles.id)))
  GROUP BY donation.id, "donationRequest".id, profiles.id, donation_timers.donation_id, donation_timers.expiration_time, donation_timers.timer_start_time, donation_timers.timer_canceled;



