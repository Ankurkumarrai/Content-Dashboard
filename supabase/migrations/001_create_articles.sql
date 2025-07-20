-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  author TEXT NOT NULL,
  author_avatar TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  external_url TEXT,
  read_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table for user favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Create user_bookmarks table for user bookmarks
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (true);
CREATE POLICY "User favorites are viewable by the user" ON user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User bookmarks are viewable by the user" ON user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Insert sample articles with real content
INSERT INTO articles (title, description, content, category, author, author_avatar, image_url, external_url, read_time, tags, likes, shares, comments, featured, trending) VALUES
(
  'Revolutionary AI Breakthrough Changes Everything', 
  'Scientists have developed a new AI system that can understand and generate human-like reasoning across multiple domains.',
  'In a groundbreaking development that could reshape our understanding of artificial intelligence, researchers at leading institutions have unveiled an AI system capable of human-like reasoning across diverse fields. This breakthrough represents a significant leap forward in machine learning technology, with implications spanning from healthcare to climate science. The new system demonstrates unprecedented capability in understanding context, making logical inferences, and generating solutions to complex problems that previously required human expertise.',
  'technology',
  'Dr. Sarah Chen',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
  'https://example.com/ai-breakthrough',
  8,
  ARRAY['AI', 'technology', 'breakthrough', 'research'],
  156,
  42,
  23,
  true,
  true
),
(
  'Climate Action Summit Delivers Historic Agreements',
  'World leaders commit to unprecedented climate action with new binding agreements on carbon reduction and renewable energy.',
  'The annual Climate Action Summit concluded with historic agreements that environmentalists are calling the most significant progress in decades. Representatives from 195 countries committed to binding carbon reduction targets, massive investments in renewable energy infrastructure, and innovative approaches to carbon capture technology. The agreements include specific timelines, accountability measures, and financial commitments that experts believe could limit global warming to 1.5 degrees Celsius.',
  'news',
  'Michael Rodriguez',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
  'https://example.com/climate-summit',
  6,
  ARRAY['climate', 'environment', 'politics', 'sustainability'],
  203,
  67,
  34,
  true,
  true
),
(
  'Quantum Computing Reaches New Milestone',
  'A team of quantum physicists has achieved a new record in quantum coherence, bringing practical quantum computers closer to reality.',
  'Quantum computing has reached another significant milestone as researchers successfully maintained quantum coherence for over 100 microseconds in a 100-qubit system. This achievement brings us substantially closer to practical quantum computers that could revolutionize cryptography, drug discovery, and complex optimization problems. The breakthrough involves novel error correction techniques and advanced quantum state stabilization methods.',
  'science',
  'Dr. Emma Thompson',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'https://example.com/quantum-milestone',
  7,
  ARRAY['quantum', 'computing', 'physics', 'technology'],
  89,
  28,
  15,
  false,
  true
),
(
  'Revolutionary Medical Treatment Shows Promise',
  'A new gene therapy approach demonstrates remarkable success in treating previously incurable genetic disorders.',
  'Medical researchers have announced promising results from clinical trials of a groundbreaking gene therapy treatment. The therapy targets rare genetic disorders that previously had no effective treatment options. Early results show significant improvement in patient outcomes with minimal side effects. The treatment uses advanced CRISPR technology combined with novel delivery mechanisms to precisely edit genetic sequences.',
  'health',
  'Dr. James Wilson',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
  'https://example.com/gene-therapy',
  9,
  ARRAY['medicine', 'genetics', 'healthcare', 'breakthrough'],
  134,
  51,
  27,
  true,
  false
),
(
  'Space Mission Achieves Historic Milestone',
  'The latest Mars exploration mission has made groundbreaking discoveries about ancient life on the Red Planet.',
  'NASA''s latest Mars rover mission has uncovered compelling evidence of ancient microbial life on Mars. The discovery includes fossilized organic compounds and mineral formations that strongly suggest the presence of life billions of years ago. This finding has profound implications for our understanding of life in the universe and the potential for life on other planets. The mission continues to analyze samples and send data back to Earth.',
  'science',
  'Dr. Lisa Park',
  'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
  'https://example.com/mars-discovery',
  10,
  ARRAY['space', 'Mars', 'discovery', 'NASA'],
  267,
  89,
  45,
  true,
  true
),
(
  'Breakthrough in Renewable Energy Storage',
  'Scientists develop new battery technology that could solve renewable energy storage challenges.',
  'A revolutionary battery technology promises to solve one of renewable energy''s biggest challenges: storage. The new lithium-sulfur batteries can store 10 times more energy than current technology while being significantly more cost-effective. This breakthrough could make renewable energy sources like solar and wind more reliable and practical for widespread adoption. The technology is expected to reach commercial production within five years.',
  'technology',
  'Dr. David Kim',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  'https://example.com/battery-breakthrough',
  6,
  ARRAY['energy', 'battery', 'renewable', 'sustainability'],
  178,
  63,
  31,
  false,
  true
),
(
  'Global Entertainment Industry Transformation',
  'Streaming platforms revolutionize content creation with AI-assisted production and immersive experiences.',
  'The entertainment industry is undergoing a massive transformation as streaming platforms integrate artificial intelligence into content creation. New AI tools are helping creators develop more engaging storylines, optimize production schedules, and create personalized viewing experiences. Virtual and augmented reality technologies are also being integrated to offer immersive entertainment experiences that blur the line between passive viewing and interactive participation.',
  'entertainment',
  'Alex Johnson',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop',
  'https://example.com/entertainment-ai',
  5,
  ARRAY['entertainment', 'AI', 'streaming', 'technology'],
  95,
  32,
  18,
  false,
  false
),
(
  'Social Media Platforms Implement Mental Health Features',
  'Major social platforms introduce comprehensive mental health support tools and wellness features.',
  'Leading social media platforms have announced comprehensive mental health initiatives designed to support user wellbeing. The new features include mood tracking, mental health resources, crisis intervention tools, and AI-powered content filtering to reduce exposure to harmful content. These initiatives represent a significant shift in how social media companies approach user safety and mental health concerns.',
  'social',
  'Taylor Smith',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  'https://example.com/social-mental-health',
  7,
  ARRAY['social media', 'mental health', 'wellness', 'technology'],
  221,
  74,
  56,
  true,
  false
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();