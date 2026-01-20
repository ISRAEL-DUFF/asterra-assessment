import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

export const spaFallback = (req: Request, res: Response, next: NextFunction): void => {
  // Skip if it's an API route
  if (req.path.startsWith('/api')) {
    next()
    return
  }

  // If file has an extension (like .js, .css, .png), let express.static handle it
  if (path.extname(req.path)) {
    next()
    return
  }

  // For routes without extension, serve index.html for SPA routing
  const indexPath = path.join(__dirname, '../../public/index.html')

  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(indexPath)
    } else {
      next()
    }
  })
}
