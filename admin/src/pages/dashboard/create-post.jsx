import { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Typography,
	Input,
	Textarea,
	Select,
	Option,
	Chip,
	Switch,
	Button,
	IconButton,
} from "@material-tailwind/react";
import { PhotoIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function CreatePost() {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("general");
	const [summary, setSummary] = useState("");
	const [content, setContent] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState(["news", "city-life"]);
	const [isPublished, setIsPublished] = useState(false);

	const addTag = () => {
		const value = tagInput.trim();
		if (!value || tags.includes(value)) return;
		setTags([...tags, value]);
		setTagInput("");
	};

	const removeTag = (tag) => {
		setTags(tags.filter((t) => t !== tag));
	};

	return (
		<div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
			<Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
				<CardHeader
					floated={false}
					shadow={false}
					color="transparent"
					className="p-6"
				>
					<Typography variant="h5" color="blue-gray">
						Create a new post
					</Typography>
					<Typography variant="small" className="text-blue-gray-500">
						Mock form: fill it out to see a live preview on the right.
					</Typography>
				</CardHeader>
				<CardBody className="pt-0 px-6 pb-6">
					<div className="grid grid-cols-1 gap-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Input
								label="Post title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<Select
								label="Category"
								value={category}
								onChange={(value) => setCategory(value || "general")}
							>
								<Option value="general">General</Option>
								<Option value="events">Events</Option>
								<Option value="guides">Guides</Option>
								<Option value="updates">Updates</Option>
							</Select>
						</div>

						<Textarea
							label="Short summary"
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
							rows={3}
						/>

						<Textarea
							label="Content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={6}
						/>

						<div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-center">
							<div className="flex items-end gap-2">
								<Input
									label="Add a tag"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTag();
										}
									}}
								/>
								<IconButton color="blue-gray" variant="outlined" onClick={addTag}>
									<PlusIcon className="w-5 h-5" />
								</IconButton>
							</div>
							<div className="flex items-center justify-end gap-3">
								<Switch
									id="publish-switch"
									checked={isPublished}
									onChange={() => setIsPublished(!isPublished)}
									label="Mark as published"
								/>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<Chip
									key={tag}
									value={tag}
									color="blue-gray"
									variant="ghost"
									icon={
										<XMarkIcon
											className="w-4 h-4 cursor-pointer"
											onClick={() => removeTag(tag)}
										/>
									}
								/>
							))}
						</div>

						<div className="rounded-lg border border-dashed border-blue-gray-200 bg-blue-gray-50/50 p-6 flex flex-col items-center justify-center gap-3 text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
								<PhotoIcon className="w-6 h-6 text-blue-gray-400" />
							</div>
							<Typography variant="small" color="blue-gray">
								Cover image uploader placeholder
							</Typography>
							<Typography variant="small" className="text-blue-gray-400">
								Drop an image here or click upload (mocked)
							</Typography>
							<div className="flex gap-2">
								<Button size="sm" color="blue-gray" variant="outlined">
									Browse files
								</Button>
								<Button size="sm" color="blue-gray" variant="text">
									Pick from library
								</Button>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button color="blue-gray" variant="text">
								Reset
							</Button>
							<Button color="blue">Save draft</Button>
							<Button color="green">Publish</Button>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card className="border border-blue-gray-100 shadow-sm h-fit sticky top-24">
				<CardHeader
					floated={false}
					shadow={false}
					color="transparent"
					className="p-6 pb-2"
				>
					<Typography variant="h6" color="blue-gray">
						Live preview
					</Typography>
					<Typography variant="small" className="text-blue-gray-500">
						This mirrors what you type on the left.
					</Typography>
				</CardHeader>
				<CardBody className="px-6 pb-6">
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<Chip
							size="sm"
							color="blue"
							value={category}
							className="capitalize"
						/>
						<Chip
							size="sm"
							color={isPublished ? "green" : "amber"}
							value={isPublished ? "Published" : "Draft"}
						/>
					</div>
					<Typography variant="h4" color="blue-gray" className="mb-2">
						{title || "Untitled post"}
					</Typography>
					<Typography variant="small" className="text-blue-gray-500 mb-4">
						{summary || "Write a short summary to grab attention."}
					</Typography>
					<div className="prose prose-sm max-w-none text-blue-gray-700">
						{content ? (
							content.split("\n").map((p, idx) => (
								<p key={idx} className="mb-2">
									{p}
								</p>
							))
						) : (
							<p>Start typing content to see it previewed here.</p>
						)}
					</div>
					{tags.length > 0 && (
						<div className="mt-6 flex flex-wrap gap-2">
							{tags.map((tag) => (
								<Chip key={tag} value={`#${tag}`} variant="ghost" />
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}

export default CreatePost;
