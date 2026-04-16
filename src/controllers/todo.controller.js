import {Todo} from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    
    const {title, completed, priority, tags, dueDate} = req.body
    
    
    const todo = await Todo.create({
      title,
      completed : completed ?? false,
      priority,
      tags,
      dueDate,
    })
    
    res.status(201).json(todo)
  } catch (error) {
    next(error)
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const skip = (page-1) * limit;
      const filter = {}
      if (req.query.completed !== undefined)
      {
        filter.completed = req.query.completed === "true";
      }

      if (req.query.priority){
        filter.priority = req.query.priority
      }
      if (req.query.search){
        filter.title = {
          $regex : req.query.search,
          $options : "i",
        }
      }
        const total = await Todo.countDocuments(filter)
        const data = await Todo.find(filter).skip(skip).limit(limit)

        res.json({
          data,
          meta:{
            total,
            page,
            limit,
            pages: Math.ceil(total/limit)
          }
        })
      

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params
    const record = await Todo.findById(id)

    if (!record){
      return res.status(404).json({error:{message : "Todo not found"}})
    }
    res.json(record)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators : true
    })
    
    if (!todo){
      return res.status(404).json({error : {message : "Todo not found"}})
    } 
    res.json(todo)    
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params
    const record = await Todo.findById(id)
    if (!record){
      return res.status(404).json({error : {message : "Todo not found"}})

    }
    record.completed = !record.completed
    await record.save()

    return res.json(record)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params
    
    const record = await Todo.findByIdAndDelete(id)
    if (!record){
      return res.status(404).json({error : {message : "Todo not found"}})
    }
    return res.sendStatus(204)
  } catch (error) {
    next(error);
  }
}
