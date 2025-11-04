export interface Entry {
  _id: string
  user_id: string
  title: string
  content: string
  tags?: string
  createdAt: string
  createdBy: string
  updatedAt: string
}

// Tror ej vi behöver denna ??
// export interface NewEntry {
//   title: string
//   content: string
//   tags?: string
// }
