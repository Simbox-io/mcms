'use client'
import { useState } from 'react';
import FileUpload from "@/components/FileUpload";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import MultipleSelector, { Option } from "@/components/TagInput";

export default function FileUploadPage() {
    const [tags, setTags] = useState<Option[]>([]);
    const removeTag = (tag: Option) => {
        setTags((prevTags) => prevTags.filter((prevTag) => prevTag !== tag));
    }
    const onFileSelect = (file: File) => {
        console.log(file);
    }
    const onFileUpload = (file: File) => {
        console.log(file);
    }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 space-y-8">
      <h1 className="text-2xl font-bold">Upload File</h1>
      <form className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="file-name">File Name</Label>
          <Input id="file-name" placeholder="Enter file name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Write a brief description" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="tags">Tags</Label>
         <MultipleSelector value={tags as Option[]} onChange={() => setTags} />
        </div>
        <div className="grid gap-1.5 items-center">
          <Label htmlFor="visibility">Visibility</Label>
          <RadioGroup className="flex items-center gap-4" defaultValue="private" id="visibility">
            <Label className="flex items-center gap-2 font-normal" htmlFor="private">
              <RadioGroupItem id="private" value="private" />
              Private
            </Label>
            <Label className="flex items-center gap-2 font-normal" htmlFor="public">
              <RadioGroupItem id="public" value="public" />
              Public
            </Label>
          </RadioGroup>
        </div>
        <div className="grid gap-1.5">
        <FileUpload onFileSelect={() => onFileSelect} onFileUpload={() => onFileUpload} />
        </div>
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}


            

