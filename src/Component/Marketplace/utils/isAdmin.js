// Utility to check admin users for the Marketplace
// Prefer updating this list to a secure source (Firestore user doc or custom claims)

const ADMIN_UIDS = [
  'msLzg2LxX7Rd3WKVwaqmhWl9KUk2',
  'QrUFuc0dERRPqhXDwZKc85ByLVj2',
  'Gsz4iCYyQVc5hFoiS4YnidLJ8ML2'
];

const ADMIN_EMAILS = [
  'praiseoluwabuni@gmail.com',
  'praisecrackdev@gmail.com'
];

export default function isAdmin(user) {
  if (!user) return false;
  try {
    if (user.uid && ADMIN_UIDS.includes(user.uid)) return true;
    if (user.email && ADMIN_EMAILS.includes(user.email)) return true;
  } catch (e) {
    console.warn('isAdmin check failed', e);
  }
  return false;
}
