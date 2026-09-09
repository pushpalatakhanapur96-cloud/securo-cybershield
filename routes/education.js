const express = require('express');
const education = require('../services/cyberedEducation');
const router = express.Router();

/**
 * GET /api/education/courses
 * Get all available courses
 */
router.get('/courses', (req, res) => {
  try {
    const courses = education.getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/courses/:courseId
 * Get course details
 */
router.get('/courses/:courseId', (req, res) => {
  try {
    const { courseId } = req.params;
    const course = education.getCourseDetails(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/articles
 * Get all threat articles
 */
router.get('/articles', (req, res) => {
  try {
    const { category } = req.query;
    let articles = education.getThreatArticles();
    if (category) {
      articles = education.getArticlesByCategory(category);
    }
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/tips
 * Get daily security tips
 */
router.get('/tips', (req, res) => {
  try {
    const tips = education.getSecurityTips();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/quiz/:courseId
 * Get quiz for a course
 */
router.get('/quiz/:courseId', (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = education.getQuiz(courseId);
    if (!quiz || quiz.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
