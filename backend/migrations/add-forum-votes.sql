-- Add upvotes and downvotes to forum_threads table
ALTER TABLE forum_threads 
ADD COLUMN IF NOT EXISTS upvotes UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS downvotes UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;

-- Add upvotes and downvotes to forum_replies table
ALTER TABLE forum_replies 
ADD COLUMN IF NOT EXISTS upvotes UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS downvotes UUID[] DEFAULT '{}';

-- Update existing rows to have empty arrays if NULL
UPDATE forum_threads SET upvotes = '{}' WHERE upvotes IS NULL;
UPDATE forum_threads SET downvotes = '{}' WHERE downvotes IS NULL;
UPDATE forum_replies SET upvotes = '{}' WHERE upvotes IS NULL;
UPDATE forum_replies SET downvotes = '{}' WHERE downvotes IS NULL;
