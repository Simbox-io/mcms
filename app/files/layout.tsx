'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FiGrid, FiList } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import CategoryFilter from '@/components/CategoryFilter';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filterQuery, setFilterQuery] = useState('');
    const [viewingFile, setViewingFile] = useState(false)

    const handleUploadFile = () => {
        router.push('/files/upload');
    };

    const handleChangeCategory = (category: string) => {
        console.log(category);
    };

    const toggleView = () => {
        setView(view === 'grid' ? 'list' : 'grid');
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="container mx-auto px-4 py-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Files</h1>
                    <div className="flex items-center space-x-4">
                        <Button variant="primary" onClick={handleUploadFile}>
                            <IoMdAdd />
                        </Button>
                        <Button variant="secondary" onClick={toggleView}>
                            {view === 'grid' ? <FiList /> : <FiGrid />}
                        </Button>
                    </div>
                </div>
                {viewingFile === false && (<div className="mb-8">
                    <div className="flex justify-between">
                        <div className="flex-grow mr-4 ">
                            <Input
                                type="text"
                                placeholder="Filter files..."
                                value={filterQuery}
                                onChange={setFilterQuery}
                                className=""
                            />
                        </div>
                        <CategoryFilter onSelect={handleChangeCategory} options={[{ label: 'test' }, { label: 'test2' }]} className='mt-1' />
                    </div>
                </div>)}
                <AnimatePresence mode="wait">
                    {view === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className=""
                        >
                            {children}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    )
}