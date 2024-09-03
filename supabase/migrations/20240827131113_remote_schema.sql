drop view if exists "public"."donation_requests_with_categories_and_tags";

alter type "public"."status" rename to "status__old_version_to_be_dropped";

create type "public"."status" as enum ('AVAILABLE', 'PENDING', 'COMPLETE', 'UNAVAILABLE', 'FAILED');

alter table "public"."donation" alter column status type "public"."status" using status::text::"public"."status";

alter table "public"."donationRequest" alter column status type "public"."status" using status::text::"public"."status";

alter table "public"."item" alter column status type "public"."status" using status::text::"public"."status";

drop type "public"."status__old_version_to_be_dropped";

create or replace view "public"."donation_requests_with_categories_and_tags" as  SELECT "donationRequest".id AS donation_request_id,
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


create policy "authenticated can update"
on "public"."donation"
as permissive
for update
to authenticated
using (true);


create policy "authenticated user "
on "public"."donation"
as permissive
for select
to authenticated
using (true);


create policy "authenticated can add"
on "public"."donation_items"
as permissive
for insert
to authenticated
with check (true);



