import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminQuestionRoutes from './routes/admin/questionRoutes.js';
import adminInterviewRoutes from './routes/admin/interviewRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('AI Career Portal Backend (Node) running'));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/questions', adminQuestionRoutes);
app.use('/api/admin/interviews', adminInterviewRoutes);
app.use('/api/interview', interviewRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
