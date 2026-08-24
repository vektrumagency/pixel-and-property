-- Gallery entries become {id, type} objects so a project can mix images and video.
-- Existing text[] rows convert to a jsonb array of plain strings; the read layer
-- normalises those legacy strings to {id, type: 'image'}.
alter table projects
  alter column gallery type jsonb using to_jsonb(gallery);

alter table page_assets drop constraint page_assets_page_check;
alter table page_assets add constraint page_assets_page_check
  check (page in ('home','digital','management','investments'));
