drop policy "corresponding beneficiary can update" on "public"."donationRequest";

drop policy "corresponding beneficiary can update" on "public"."item";

alter table "public"."item" add column "status" status;

create policy "authenticated users"
on "public"."donationRequest"
as permissive
for update
to authenticated
using (true);


create policy "authenticated user"
on "public"."item"
as permissive
for update
to authenticated
using (true);



