alter table public.blog_posts
  add column if not exists section_1_heading_en text not null default '',
  add column if not exists section_1_heading_vi text not null default '',
  add column if not exists section_1_body_en text not null default '',
  add column if not exists section_1_body_vi text not null default '',
  add column if not exists section_2_heading_en text not null default '',
  add column if not exists section_2_heading_vi text not null default '',
  add column if not exists section_2_body_en text not null default '',
  add column if not exists section_2_body_vi text not null default '',
  add column if not exists section_3_heading_en text not null default '',
  add column if not exists section_3_heading_vi text not null default '',
  add column if not exists section_3_body_en text not null default '',
  add column if not exists section_3_body_vi text not null default '';

update public.blog_posts
set
  section_1_heading_en = 'Why this guide matters',
  section_1_heading_vi = 'Vì sao cẩm nang này hữu ích với bạn',
  section_1_body_en = content_en,
  section_1_body_vi = replace(content_vi, '1. Vì sao cẩm nang này hữu ích với bạn' || E'\n\n', ''),
  section_2_heading_en = 'Planning your time in Hội An',
  section_2_heading_vi = 'Lên kế hoạch thời gian tại Hội An',
  section_2_body_en = 'Use this section for practical timings, locations, prices and first-hand recommendations. Keep each paragraph focused so travelers can scan the guide easily.',
  section_2_body_vi = 'Sử dụng phần này để chia sẻ thời gian phù hợp, địa điểm, chi phí và những gợi ý thực tế. Mỗi đoạn nên ngắn gọn để du khách dễ dàng theo dõi.',
  section_3_heading_en = 'Local photography tips',
  section_3_heading_vi = 'Mẹo chụp ảnh từ người địa phương',
  section_3_body_en = 'Add useful, experience-led advice about light, clothing, crowds and the best way to move through the Ancient Town comfortably.',
  section_3_body_vi = 'Thêm những lời khuyên hữu ích về ánh sáng, trang phục, lượng khách và cách di chuyển thoải mái qua Phố Cổ.'
where slug = 'best-places-for-a-photoshoot-in-hoi-an'
  and section_1_heading_en = '';

insert into public.albums
  (slug, title_en, title_vi, category_en, category_vi, description_en, description_vi, cover_image, is_published, sort_order)
values
  ('package-solo', 'Solo Package Gallery', 'Album gói chụp cá nhân', 'Package Gallery · Solo', 'Album gói chụp cá nhân', 'Photos used in the Solo package cover and detail carousel.', 'Ảnh dùng cho ảnh bìa và thanh trượt chi tiết của gói chụp cá nhân.', 'https://drive.google.com/thumbnail?id=1yRsPxrb7IYFqWF3v7rBqnYBhBI3JkExD&sz=w1800', true, 101),
  ('package-couple', 'Couple Package Gallery', 'Album gói chụp cặp đôi', 'Package Gallery · Couple', 'Album gói chụp cặp đôi', 'Photos used in the Couple package cover and detail carousel.', 'Ảnh dùng cho ảnh bìa và thanh trượt chi tiết của gói chụp cặp đôi.', 'https://drive.google.com/thumbnail?id=1noiT3J_eEyJ0oq0eKZkJLIvWRQAymPmP&sz=w1800', true, 102),
  ('package-family', 'Family Package Gallery', 'Album gói chụp gia đình', 'Package Gallery · Family', 'Album gói chụp gia đình', 'Photos used in the Family package cover and detail carousel.', 'Ảnh dùng cho ảnh bìa và thanh trượt chi tiết của gói chụp gia đình.', 'https://drive.google.com/thumbnail?id=1GG26n8q6gm79eoqi_gQxjqiQ_CSgKwyG&sz=w1800', true, 103),
  ('package-group', 'Group Package Gallery', 'Album gói chụp nhóm', 'Package Gallery · Group', 'Album gói chụp nhóm', 'Photos used in the Group package cover and detail carousel.', 'Ảnh dùng cho ảnh bìa và thanh trượt chi tiết của gói chụp nhóm.', 'https://drive.google.com/thumbnail?id=1UehLJlP41QZ8jWEKZmB3pSd-40nWXacq&sz=w1800', true, 104)
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_vi = excluded.title_vi,
  category_en = excluded.category_en,
  category_vi = excluded.category_vi,
  description_en = excluded.description_en,
  description_vi = excluded.description_vi,
  cover_image = coalesce(nullif(public.albums.cover_image, ''), excluded.cover_image),
  is_published = true,
  updated_at = now();
