import Blog from "../Models/blogModel.js";

// Create a new blog post (Admin only)
export const createBlog = async (req, res) => {
    try {
        const {
            title, permalink, description, excerpt, featuredImage, categories,
            published, datePosted, seoTitle, seoDescription, seoKeywords, seoExtraHead,
            tag, authorName
        } = req.body;

        if (!title || !permalink || !description) {
            return res.status(400).json({ message: 'Title, permalink, and description are required' });
        }

        // Check if permalink already exists
        const existingBlog = await Blog.findOne({ permalink });
        if (existingBlog) {
            return res.status(400).json({ message: 'Permalink already exists. Please use a unique permalink.' });
        }

        const newBlog = new Blog({
            title,
            permalink,
            description,
            excerpt: excerpt || '',
            featuredImage: featuredImage || '',
            categories: categories || '',
            author: req.user.id, // From auth middleware
            authorName: authorName || '',
            tag: tag || '',
            published: published || false,
            datePosted: datePosted || Date.now(),
            seoTitle: seoTitle || '',
            seoDescription: seoDescription || '',
            seoKeywords: seoKeywords || '',
            seoExtraHead: seoExtraHead || ''
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an existing blog post (Admin only)
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, permalink, description, excerpt, featuredImage, categories,
            published, datePosted, seoTitle, seoDescription, seoKeywords, seoExtraHead,
            tag, authorName
        } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // If permalink is being changed, check if new permalink already exists
        if (permalink && permalink !== blog.permalink) {
            const existingBlog = await Blog.findOne({ permalink });
            if (existingBlog) {
                return res.status(400).json({ message: 'Permalink already exists. Please use a unique permalink.' });
            }
        }

        // Update fields
        if (title) blog.title = title;
        if (permalink) blog.permalink = permalink;
        if (description) blog.description = description;
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (featuredImage !== undefined) blog.featuredImage = featuredImage;
        if (categories !== undefined) blog.categories = categories;
        if (published !== undefined) blog.published = published;
        if (datePosted) blog.datePosted = datePosted;
        if (seoTitle !== undefined) blog.seoTitle = seoTitle;
        if (seoDescription !== undefined) blog.seoDescription = seoDescription;
        if (seoKeywords !== undefined) blog.seoKeywords = seoKeywords;
        if (seoExtraHead !== undefined) blog.seoExtraHead = seoExtraHead;
        if (tag !== undefined) blog.tag = tag;
        if (authorName !== undefined) blog.authorName = authorName;

        await blog.save();
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a blog post (Admin only)
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all blogs (Admin - includes drafts)
export const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const blogs = await Blog.find()
            .populate('author', 'email')
            .sort({ datePosted: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Blog.countDocuments();

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all blogs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get published blogs only (Public)
export const getPublishedBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;

        const filter = { published: true };
        if (category) {
            filter.categories = { $regex: category, $options: 'i' };
        }

        const blogs = await Blog.find(filter)
            .populate('author', 'email')
            .sort({ datePosted: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Blog.countDocuments(filter);

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get published blogs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single blog by permalink (Public)
export const getBlogByPermalink = async (req, res) => {
    try {
        const { permalink } = req.params;

        const blog = await Blog.findOne({ permalink, published: true })
            .populate('author', 'email');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ blog });
    } catch (error) {
        console.error('Get blog by permalink error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single blog by ID (Admin)
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('author', 'email');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ blog });
    } catch (error) {
        console.error('Get blog by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Toggle publish status (Admin only)
export const togglePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.published = !blog.published;
        await blog.save();

        res.status(200).json({
            message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
            blog
        });
    } catch (error) {
        console.error('Toggle publish status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
