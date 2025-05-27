'use client'

import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Paper,
  Stack
} from '@mui/material'
import { 
  Delete, 
  Refresh 
} from '@mui/icons-material'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

function page() {
  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    displayName: '',
    bio: ''
  })
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    url: '',
    type: 'text' as 'text' | 'link' | 'image',
    authorId: '',
    subreddit: 'test'
  })
  
  const [commentForm, setCommentForm] = useState({
    content: '',
    authorId: '',
    postId: '',
    parentId: ''
  })
  
  const [voteForm, setVoteForm] = useState({
    userId: '',
    targetId: '',
    targetType: 'post' as 'post' | 'comment',
    value: 1 as 1 | -1 | 0
  })

  // Query states
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedPostId, setSelectedPostId] = useState('')
  const [subredditName, setSubredditName] = useState('test')
  
  // Mutations
  const createUser = useMutation(api.users.create)
  const createPost = useMutation(api.posts.create)
  const createComment = useMutation(api.comments.create)
  const vote = useMutation(api.votes.vote)
  const updateUser = useMutation(api.users.updateProfile)
  const updateKarma = useMutation(api.users.updateKarma)
  const removePost = useMutation(api.posts.remove)
  const removeComment = useMutation(api.comments.remove)
  
  // Queries
  const frontPagePosts = useQuery(api.posts.getFrontPage, { limit: 10 })
  const subredditPosts = useQuery(api.posts.getBySubreddit, { subreddit: subredditName, limit: 10 })
  const topUsers = useQuery(api.users.getTopUsers, { limit: 10 })
  const selectedUser = useQuery(api.users.getById, selectedUserId ? { id: selectedUserId as any } : 'skip')
  const selectedPost = useQuery(api.posts.getById, selectedPostId ? { id: selectedPostId as any } : 'skip')
  const postComments = useQuery(api.comments.getByPost, selectedPostId ? { postId: selectedPostId as any } : 'skip')

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreateUser = async () => {
    try {
      const userId = await createUser(userForm)
      showMessage('success', `User created with ID: ${userId}`)
      setUserForm({ username: '', email: '', displayName: '', bio: '' })
    } catch (error) {
      showMessage('error', `Error: ${error}`)
    }
  }

  const handleCreatePost = async () => {
    try {
      const postId = await createPost({
        ...postForm,
        authorId: postForm.authorId as Id<"users">
      })
      showMessage('success', `Post created with ID: ${postId}`)
      setPostForm({ ...postForm, title: '', content: '', url: '' })
    } catch (error) {
      showMessage('error', `Error: ${error}`)
    }
  }

  const handleCreateComment = async () => {
    try {
      const commentId = await createComment({
        content: commentForm.content,
        authorId: commentForm.authorId as Id<"users">,
        postId: commentForm.postId as Id<"posts">,
        parentId: commentForm.parentId ? commentForm.parentId as Id<"comments"> : undefined
      })
      showMessage('success', `Comment created with ID: ${commentId}`)
      setCommentForm({ ...commentForm, content: '' })
    } catch (error) {
      showMessage('error', `Error: ${error}`)
    }
  }

  const handleVote = async () => {
    try {
      await vote({
        userId: voteForm.userId as Id<"users">,
        targetId: voteForm.targetId as Id<"posts"> | Id<"comments">,
        targetType: voteForm.targetType,
        value: voteForm.value
      })
      showMessage('success', 'Vote submitted successfully')
    } catch (error) {
      showMessage('error', `Error: ${error}`)
    }
  }

  const handleUpdateKarma = async (userId: string, change: number) => {
    try {
      await updateKarma({ userId: userId as any, change })
      showMessage('success', `Karma updated by ${change}`)
    } catch (error) {
      showMessage('error', `Error: ${error}`)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Convex Database Testing Ground
      </Typography>
      
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Create User */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Create User</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
                <TextField
                  label="Display Name"
                  value={userForm.displayName}
                  onChange={(e) => setUserForm({ ...userForm, displayName: e.target.value })}
                />
                <TextField
                  label="Bio"
                  multiline
                  rows={2}
                  value={userForm.bio}
                  onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                />
                <Button variant="contained" onClick={handleCreateUser}>
                  Create User
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Create Post */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Create Post</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                />
                <TextField
                  label="Content"
                  multiline
                  rows={3}
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                />
                <TextField
                  label="URL (for link posts)"
                  value={postForm.url}
                  onChange={(e) => setPostForm({ ...postForm, url: e.target.value })}
                />
                <FormControl>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={postForm.type}
                    onChange={(e) => setPostForm({ ...postForm, type: e.target.value as any })}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="link">Link</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Author ID"
                  value={postForm.authorId}
                  onChange={(e) => setPostForm({ ...postForm, authorId: e.target.value })}
                />
                <TextField
                  label="Subreddit"
                  value={postForm.subreddit}
                  onChange={(e) => setPostForm({ ...postForm, subreddit: e.target.value })}
                />
                <Button variant="contained" onClick={handleCreatePost}>
                  Create Post
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Create Comment */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Create Comment</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Content"
                  multiline
                  rows={3}
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                />
                <TextField
                  label="Author ID"
                  value={commentForm.authorId}
                  onChange={(e) => setCommentForm({ ...commentForm, authorId: e.target.value })}
                />
                <TextField
                  label="Post ID"
                  value={commentForm.postId}
                  onChange={(e) => setCommentForm({ ...commentForm, postId: e.target.value })}
                />
                <TextField
                  label="Parent Comment ID (optional)"
                  value={commentForm.parentId}
                  onChange={(e) => setCommentForm({ ...commentForm, parentId: e.target.value })}
                />
                <Button variant="contained" onClick={handleCreateComment}>
                  Create Comment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Vote */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Cast Vote</Typography>
              <Stack spacing={2}>
                <TextField
                  label="User ID"
                  value={voteForm.userId}
                  onChange={(e) => setVoteForm({ ...voteForm, userId: e.target.value })}
                />
                <TextField
                  label="Target ID (Post/Comment ID)"
                  value={voteForm.targetId}
                  onChange={(e) => setVoteForm({ ...voteForm, targetId: e.target.value })}
                />
                <FormControl>
                  <InputLabel>Target Type</InputLabel>
                  <Select
                    value={voteForm.targetType}
                    onChange={(e) => setVoteForm({ ...voteForm, targetType: e.target.value as any })}
                  >
                    <MenuItem value="post">Post</MenuItem>
                    <MenuItem value="comment">Comment</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>Vote Value</InputLabel>
                  <Select
                    value={voteForm.value}
                    onChange={(e) => setVoteForm({ ...voteForm, value: e.target.value as any })}
                  >
                    <MenuItem value={1}>Upvote (+1)</MenuItem>
                    <MenuItem value={-1}>Downvote (-1)</MenuItem>
                    <MenuItem value={0}>Remove Vote (0)</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleVote}>
                  Cast Vote
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Users */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Top Users 
                <IconButton onClick={() => window.location.reload()}>
                  <Refresh />
                </IconButton>
              </Typography>
              <Grid container spacing={2}>
                {topUsers?.map((user) => (
                  <Grid key={user._id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.displayName || user.email}
                      </Typography>
                      <Typography variant="body2">Karma: {user.karma}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          size="small" 
                          onClick={() => setSelectedUserId(user._id)}
                          variant={selectedUserId === user._id ? "contained" : "outlined"}
                        >
                          Select
                        </Button>
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handleUpdateKarma(user._id, 10)}
                          sx={{ ml: 1 }}
                        >
                          +10 Karma
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleUpdateKarma(user._id, -5)}
                          sx={{ ml: 1 }}
                        >
                          -5 Karma
                        </Button>
                      </Box>
                      <Typography variant="caption" display="block">
                        ID: {user._id}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Posts */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Front Page Posts</Typography>
              <Stack spacing={2}>
                {frontPagePosts?.map((post) => (
                  <Paper key={post._id} sx={{ p: 2 }}>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      r/{post.subreddit} • Score: {post.score} • Comments: {post.commentCount}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Button 
                        size="small"
                        onClick={() => setSelectedPostId(post._id)}
                        variant={selectedPostId === post._id ? "contained" : "outlined"}
                      >
                        Select
                      </Button>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={async () => {
                          try {
                            await removePost({ id: post._id })
                            showMessage('success', 'Post removed')
                          } catch (error) {
                            showMessage('error', `Error: ${error}`)
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" display="block">
                      ID: {post._id}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Comments for Selected Post */}
        <Grid >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Comments {selectedPostId && `for Post ${selectedPostId.slice(-8)}`}
              </Typography>
              {!selectedPostId && (
                <Typography color="text.secondary">Select a post to view comments</Typography>
              )}
              <Stack spacing={2}>
                {postComments?.map((comment) => (
                  <Paper key={comment._id} sx={{ p: 2, ml: comment.depth * 2 }}>
                    <Typography variant="body1">{comment.content}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Score: {comment.score} • Depth: {comment.depth} • Children: {comment.childCount}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={async () => {
                          try {
                            await removeComment({ id: comment._id })
                            showMessage('success', 'Comment removed')
                          } catch (error) {
                            showMessage('error', `Error: ${error}`)
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" display="block">
                      ID: {comment._id}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Selected User Details */}
        {selectedUser && (
          <Grid >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Selected User Details</Typography>
                <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
                <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                <Typography><strong>Display Name:</strong> {selectedUser.displayName || 'None'}</Typography>
                <Typography><strong>Bio:</strong> {selectedUser.bio || 'None'}</Typography>
                <Typography><strong>Karma:</strong> {selectedUser.karma}</Typography>
                <Typography><strong>Admin:</strong> {selectedUser.isAdmin ? 'Yes' : 'No'}</Typography>
                <Typography><strong>Banned:</strong> {selectedUser.isBanned ? 'Yes' : 'No'}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Selected Post Details */}
        {selectedPost && (
          <Grid >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Selected Post Details</Typography>
                <Typography><strong>Title:</strong> {selectedPost.title}</Typography>
                <Typography><strong>Type:</strong> {selectedPost.type}</Typography>
                <Typography><strong>Subreddit:</strong> r/{selectedPost.subreddit}</Typography>
                <Typography><strong>Score:</strong> {selectedPost.score}</Typography>
                <Typography><strong>Upvotes:</strong> {selectedPost.upvotes}</Typography>
                <Typography><strong>Downvotes:</strong> {selectedPost.downvotes}</Typography>
                <Typography><strong>Comments:</strong> {selectedPost.commentCount}</Typography>
                <Typography><strong>Content:</strong> {selectedPost.content || 'None'}</Typography>
                <Typography><strong>URL:</strong> {selectedPost.url || 'None'}</Typography>
                <Typography><strong>Created:</strong> {new Date(selectedPost.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default page