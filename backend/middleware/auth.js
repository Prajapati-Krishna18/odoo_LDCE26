import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    let userId = null;

    // 1. Try local verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'globetrotter_super_secret_token_123');
      userId = decoded.id || decoded.sub;
    } catch (localError) {
      // 2. Fallback: verify against Supabase Auth API using token
      const supabaseUrl = process.env.SUPABASE_URL || 'https://sgrhibwrogtutmxhzlmp.supabase.co';
      // Use standard JWT anon key for verification API call
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncmhpYndyb2d0dXRteGh6bG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNjMzMTMsImV4cCI6MjEwMjkzOTMxM30.mzdPK8sbpipq-823KBmmbubvLQgHitky2vPOGbreqIk';

      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const supabaseUser = await response.json();
        userId = supabaseUser.id;
      } else {
        throw new Error('Supabase token verification failed');
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found. Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }
};
