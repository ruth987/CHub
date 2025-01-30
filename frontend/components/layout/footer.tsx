import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">ChristianHub</h3>
            <p className="text-sm">
              Growing together in faith, knowledge, and community.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/bible-plans">Bible Plans</Link></li>
              <li><Link href="/community">Community</Link></li>
              <li><Link href="/questions">Questions</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/devotionals">Daily Devotionals</Link></li>
              <li><Link href="/study-groups">Study Groups</Link></li>
              <li><Link href="/prayer-requests">Prayer Requests</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ChristianHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}