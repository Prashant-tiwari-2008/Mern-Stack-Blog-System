import express from 'express';
import cors from 'cors';
import './config/db.config.js'
import cookieParser from 'cookie-parser';

//routes import
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import blogRoutes from './routes/blog.routes.js';
import commentRoutes from './routes/comment.routes.js';
import path from 'path'

const __dirname = path.resolve()

const app = express();
let port = 4000;


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser()); // need to read about

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get("*",(req,res) => {
    res.sendFile(path.join((__dirname,'client','dist','index.hmlt')))
});

app.listen(port ,() =>{
    console.log(`server is running on port number ${port}`)
})

//fallback
app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    }) 
})