import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-lg border-t border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">Battle Damage Studios</span>
            </Link>
            <p className="text-muted-foreground">
              Join Our Community
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Media"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                 Media 
                </Link>
              </li>
              <li>
                <Link
                  href="/Updates"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                 Updates 
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Social
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://discord.com/invite/vn3z9hR"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/BattleDamageS#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/c/TheBickeringBunch#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-red-500/20 text-center text-muted-foreground">
          <p>© 2025 Battle Damage Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
