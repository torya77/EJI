import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Camera,
  Users,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { mockPosts, mockUser } from '../data/mock';

const Social = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: mockUser.name,
        avatar: mockUser.avatar,
        content: newPost,
        location: selectedLocation,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setSelectedLocation('');
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Communauté EJI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partagez vos expériences de voyage en Algérie et découvrez celles des autres voyageurs
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{mockUser.name}</h2>
                <p className="text-gray-600 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mockUser.location}</span>
                </p>
                <div className="flex items-center space-x-6 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{mockUser.followers} abonnés</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{mockUser.following} abonnements</span>
                  </div>
                  <div className="text-sm text-gray-600">{mockUser.posts} publications</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <span>Partager une expérience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Partagez votre dernière aventure en Algérie..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] border-gray-200 focus:border-purple-500"
              />
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Ajouter une localisation..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="border-gray-200 focus:border-purple-500"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Photo
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreatePost}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!newPost.trim()}
                >
                  Publier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatTimeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                    {post.location && (
                      <div className="flex items-center space-x-1 text-gray-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{post.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={post.image} 
                      alt="Post image"
                      className="w-full h-64 object-cover rounded-lg hover:opacity-95 transition-opacity cursor-pointer"
                    />
                  </div>
                )}
                
                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 ${
                      likedPosts.includes(post.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Charger plus de publications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Social;