/**
 * Data Migration Script for HVK Community App
 *
 * Reads an Excel spreadsheet and imports data into Supabase.
 *
 * Usage:
 *   node migrate.js <path-to-spreadsheet.xlsx>
 *
 * Environment variables required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (NOT anon key)
 *
 * The spreadsheet should have sheets named:
 *   Users, Coins, Points, Coin_Relationship, Relationships,
 *   Scripture_Memory, Discipline_Den, Discipline_Den_Comments,
 *   Discipline_Den_Likes, Forges, Forge_Events, User_Daily_Stats,
 *   User_Requests
 */

import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node migrate.js <path-to-spreadsheet.xlsx>');
  process.exit(1);
}

const workbook = XLSX.readFile(resolve(filePath));

function getSheetData(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found, skipping.`);
    return null;
  }
  return XLSX.utils.sheet_to_json(sheet);
}

function convertPointRefToArray(pointRefStr) {
  if (!pointRefStr) return [];
  if (Array.isArray(pointRefStr)) return pointRefStr;
  return pointRefStr.split(',').map(s => s.trim()).filter(Boolean);
}

function convertTagsToArray(tagsStr) {
  if (!tagsStr) return [];
  if (Array.isArray(tagsStr)) return tagsStr;
  return tagsStr.split(',').map(s => s.trim()).filter(Boolean);
}

async function insertBatch(tableName, rows, batchSize = 50) {
  if (!rows || rows.length === 0) {
    console.log(`  No data for ${tableName}, skipping.`);
    return;
  }

  console.log(`  Inserting ${rows.length} rows into ${tableName}...`);

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).upsert(batch, { onConflict: getConflictKey(tableName) });
    if (error) {
      console.error(`  Error inserting into ${tableName} (batch ${Math.floor(i / batchSize) + 1}):`, error.message);
      console.error('  First row of failing batch:', JSON.stringify(batch[0], null, 2));
    }
  }
}

function getConflictKey(tableName) {
  const keys = {
    users: 'user_id',
    coins: 'coin_id',
    points: 'point_id',
    coin_relationships: 'coin_relationship_id',
    relationships: 'relationship_id',
    scripture_memory: 'scripture_id',
    discipline_den: 'discipline_den_id',
    discipline_den_comments: 'discipline_den_comment_id',
    discipline_den_likes: 'discipline_den_likes_id',
    forges: 'forge_id',
    forge_events: 'event_id',
    user_daily_stats: 'stat_id',
    user_requests: 'user_request_id',
  };
  return keys[tableName] || undefined;
}

async function migrate() {
  console.log('Starting HVK data migration...\n');

  // 1. Users (must be first — other tables reference users)
  console.log('1. Migrating Users...');
  const usersData = getSheetData('Users');
  if (usersData) {
    const users = usersData.map(row => ({
      user_id: row.user_id,
      user_email: row.user_email,
      user_first_name: row.user_first_name,
      user_last_name: row.user_last_name,
      user_name: row.User_Name || row.user_name,
      user_login_email: row.User_Login_Email || row.user_login_email,
      user_notification_email: row.User_Notification_Email || row.user_notification_email,
      user_role: row.User_Role || row.user_role || 'User',
      user_invited_by: row.user_invited_by || null,
      user_start_date: row.user_start_date || null,
      user_clan: row.user_clan || null,
      user_state: row.user_state || null,
      user_photo_source: row.User_Photo_Source || row.user_photo_source || 'Avatar',
      user_photo_upload: row.User_Photo_Upload || row.user_photo_upload || null,
      user_faith_profession: row.User_Faith_Profession || row.user_faith_profession || null,
      skin_color: row.Skin_Color || row.skin_color || 'Light',
      top: row.Top || row.top || 'ShortHairShortFlat',
      hair_color: row.HairColor || row.hair_color || 'Brown',
      accessories: row.Accessories || row.accessories || 'Blank',
      facial_hair: row.FacialHair || row.facial_hair || 'Blank',
      facial_hair_color: row.FacialHairColor || row.facial_hair_color || 'Brown',
      clothes: row.Clothes || row.clothes || 'ShirtCrewNeck',
      clothe_color: row.ClotheColor || row.clothe_color || 'Black',
      graphic: row.Graphic || row.graphic || 'Bat',
      eyes: row.Eyes || row.eyes || 'Default',
      eyebrow: row.Eyebrow || row.eyebrow || 'Default',
      mouth: row.Mouth || row.mouth || 'Default',
      background_or_transparent: row.Background_or_Transparent || row.background_or_transparent || 'Circle',
    }));
    await insertBatch('users', users);
  }

  // 2. Coins (reference table)
  console.log('2. Migrating Coins...');
  const coinsData = getSheetData('Coins');
  if (coinsData) {
    const coins = coinsData.map(row => ({
      coin_id: row.coin_id,
      coin_order: row.coin_order,
      coin_description: row.coin_description,
    }));
    await insertBatch('coins', coins);
  }

  // 3. Points (reference table)
  console.log('3. Migrating Points...');
  const pointsData = getSheetData('Points');
  if (pointsData) {
    const points = pointsData.map(row => ({
      point_id: row.point_id,
      point_activity: row.point_activity,
      point_value: row.point_value,
      point_category: row.point_category,
      point_coin_type: row.point_coin_type,
      point_role: row.point_role || 'All',
      point_day: row.point_day || null,
    }));
    await insertBatch('points', points);
  }

  // 4. Relationships
  console.log('4. Migrating Relationships...');
  const relData = getSheetData('Relationships');
  if (relData) {
    const relationships = relData.map(row => ({
      relationship_id: row.relationship_id,
      mentor_id: row.mentor_id,
      disciple_id: row.disciple_id,
      date_of_relationship: row.date_of_relationship || null,
    }));
    await insertBatch('relationships', relationships);
  }

  // 5. Coin Relationships (transaction ledger)
  console.log('5. Migrating Coin Relationships...');
  const coinRelData = getSheetData('Coin_Relationship');
  if (coinRelData) {
    const coinRels = coinRelData.map(row => ({
      coin_relationship_id: row.coin_relationship_id,
      coin_user_id: row.coin_user_id,
      coin_type_id: row.coin_type_id,
      coin_date: row.coin_date || null,
      coin_relationship_point_ref: convertPointRefToArray(row.Coin_relationship_point_ref || row.coin_relationship_point_ref),
      coin_relationship_date_rewarded: row.Coin_relationship_date_rewarded || row.coin_relationship_date_rewarded || null,
      coin_relationship_day: row.coin_relationship_day || null,
      coin_relationship_edge_keeper_id: row.coin_relationship_edge_keeper_id || null,
      coin_relationship_forge_keeper_id: row.coin_relationship_forge_keeper_id || null,
      coin_relationship_talent_amount: row.coin_relationship_talent_amount || 0,
      coin_relationship_gift_from_id: row.coin_relationship_gift_from_id || null,
    }));
    await insertBatch('coin_relationships', coinRels);
  }

  // 6. Scripture Memory
  console.log('6. Migrating Scripture Memory...');
  const scriptureData = getSheetData('Scripture_Memory');
  if (scriptureData) {
    const scriptures = scriptureData.map(row => ({
      scripture_id: row.scripture_id,
      scripture_book: row.scripture_book,
      scripture_chapter: row.scripture_chapter,
      scripture_verse_start: row.scripture_verse_start,
      scripture_verse_end: row.scripture_verse_end || null,
      scripture_user: row.scripture_user,
      scripture_verse: row.scripture_verse || null,
      scripture_tag: convertTagsToArray(row.scripture_tag),
      scripture_role: row.scripture_role || null,
      scripture_hide_verse: row.scripture_hide_verse || false,
      scripture_due_date: row.scripture_due_date || null,
      scripture_image: row.scripture_image || null,
    }));
    await insertBatch('scripture_memory', scriptures);
  }

  // 7. Discipline Den (posts)
  console.log('7. Migrating Discipline Den Posts...');
  const denData = getSheetData('Discipline_Den');
  if (denData) {
    const posts = denData.map(row => ({
      discipline_den_id: row.discipline_den_id,
      discipline_den_caption: row.discipline_den_caption || null,
      discipline_den_img: row.discipline_den_img || null,
      discipline_den_date_created: row.discipline_den_date_created || null,
      discipline_den_user: row.discipline_den_user,
      discipline_den_link: row.discipline_den_link || null,
      discipline_den_title: row.discipline_den_title || null,
    }));
    await insertBatch('discipline_den', posts);
  }

  // 8. Discipline Den Comments
  console.log('8. Migrating Discipline Den Comments...');
  const commentsData = getSheetData('Discipline_Den_Comments');
  if (commentsData) {
    const comments = commentsData.map(row => ({
      discipline_den_comment_id: row.discipline_den_comment_id,
      discipline_den_comment_date: row.discipline_den_comment_date || null,
      discipline_den_comment_parent_ref: row.discipline_den_comment_parent_ref,
      discipline_den_comment_text: row.discipline_den_comment_text,
      discipline_den_comment_user_id: row.discipline_den_comment_user_id,
    }));
    await insertBatch('discipline_den_comments', comments);
  }

  // 9. Discipline Den Likes
  console.log('9. Migrating Discipline Den Likes...');
  const likesData = getSheetData('Discipline_Den_Likes');
  if (likesData) {
    const likes = likesData.map(row => ({
      discipline_den_likes_id: row.discipline_den_likes_id,
      discipline_den_likes_date: row.discipline_den_likes_date || null,
      discipline_den_likes_comment_parent_ref: row.discipline_den_likes_comment_parent_ref || null,
      discipline_den_comment_user_id: row.discipline_den_comment_user_id,
      discipline_den_post_ref: row.discipline_den_post_ref || null,
    }));
    await insertBatch('discipline_den_likes', likes);
  }

  // 10. Forges
  console.log('10. Migrating Forges...');
  const forgesData = getSheetData('Forges');
  if (forgesData) {
    const forges = forgesData.map(row => ({
      forge_id: row.forge_id,
      forge_date: row.forge_date,
      forge_week_type: row.forge_week_type || null,
    }));
    await insertBatch('forges', forges);
  }

  // 11. Forge Events
  console.log('11. Migrating Forge Events...');
  const eventsData = getSheetData('Forge_Events');
  if (eventsData) {
    const events = eventsData.map(row => ({
      event_id: row.event_id || row['Row ID'],
      title: row.Title || row.title,
      start_time: row.Start || row.start_time,
      end_time: row.End || row.end_time,
      location: row.Location || row.location || null,
      creator: row.Creator || row.creator || null,
      attendees: convertTagsToArray(row.Attendees || row.attendees),
      status: row.Status || row.status || null,
      web_link: row['Web Link'] || row.web_link || null,
      meet_link: row['Meet Link'] || row.meet_link || null,
      description: row.Description || row.description || null,
    }));
    await insertBatch('forge_events', events);
  }

  // 12. User Daily Stats
  console.log('12. Migrating User Daily Stats...');
  const statsData = getSheetData('User_Daily_Stats');
  if (statsData) {
    const stats = statsData.map(row => ({
      stat_id: row.stat_id,
      stat_user_id: row.stat_user_id,
      stat_event_id: row.stat_event_id || null,
      stat_date: row.stat_date,
      stat_day_type: row.stat_day_type,
      stat_points_earned: row.stat_points_earned || 0,
      stat_points_possible: row.stat_points_possible || 0,
      stat_category: row.stat_category || 'Meeting',
    }));
    await insertBatch('user_daily_stats', stats);
  }

  // 13. User Requests
  console.log('13. Migrating User Requests...');
  const requestsData = getSheetData('User_Requests');
  if (requestsData) {
    const requests = requestsData.map(row => ({
      user_request_id: row.user_request_id,
      user_request_first_name: row.user_request_first_name,
      user_request_last_name: row.user_request_last_name,
      user_request_email: row.user_request_email,
      user_request_state: row.user_request_state || null,
      user_request_invited_by: row.user_request_invited_by || null,
      user_request_status: row.user_request_status || 'New Request',
    }));
    await insertBatch('user_requests', requests);
  }

  console.log('\nMigration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
