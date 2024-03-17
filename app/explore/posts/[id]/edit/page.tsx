// app/home/[id]/edit/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { useToken } from '@/lib/useToken';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import { Editor } from '@tinymce/tinymce-react';
import {useSession} from "next-auth/react";
import {User} from "@/lib/prisma";
import {Post} from "@/lib/prisma";

const CreatePostPage: React.FC = () => {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const user = session?.user as User;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<{value: string, label: string}[]>([]);
    const router = useRouter();
    const token = useToken();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${id}`);

                if (response.ok) {
                    const data = await response.json();
                    setPost(data);
                    console.log(data);
                } else {
                    console.error('Error fetching post:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, tags: selectedTags }),
            });

            if (response.ok) {
                router.push('/posts');
            } else {
                console.error('Error creating post:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Edit Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Input
                            label="Title"
                            name="title"
                            type="text"
                            id="title"
                            value={post?.title || ''}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                            Content
                        </label>
                        <Editor
                            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                            value={post?.content || ''}
                            onEditorChange={(newContent) => setContent(newContent)}
                            init={{
                                height: 400,
                                menubar: false,
                                branding: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount',
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | image | removeformat | help',
                            }}
                        />
                    </div>
                    <div className="mb-6">
                        {/*<Select
              label="Tags"
              options={tags}
              value
              value={selectedTags}
              onChange={(tags) => setSelectedTags(Array.isArray(tags) ? tags : [tags])}
             isMulti
            />*/}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreatePostPage;