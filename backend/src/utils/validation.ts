import Joi from 'joi'
import { CreateUserRequest, CreateHobbyRequest } from '../types'

export const createUserSchema = Joi.object<CreateUserRequest>({
  first_name: Joi.string().required().trim().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required'
  }),
  last_name: Joi.string().required().trim().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required'
  }),
  address: Joi.string().optional().allow('').trim(),
  phone_number: Joi.string().optional().allow('').trim()
})

export const createHobbySchema = Joi.object<CreateHobbyRequest>({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required'
  }),
  hobbies: Joi.string().required().trim().messages({
    'string.empty': 'Hobby is required',
    'any.required': 'Hobby is required'
  })
})

export const userIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
})
