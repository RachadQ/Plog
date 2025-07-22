import React, { useEffect } from "react";
import { Mail, Users, PenSquare, Globe, Shield, TrendingUp, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const FeatureSection: React.FC<{}> = () => {
  return (
    <div>
      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Why Use Plog?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <PenSquare className="w-10 h-10 mx-auto text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Easy Writing</h3>
              <p className="text-gray-600 text-sm">
                Post updates, reflections, and tips in minutes. Markdown
                supported with rich text editing and image uploads.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <Users className="w-10 h-10 mx-auto text-green-500" />
            <div>
              <h3 className="text-xl font-semibold">Find Your Community</h3>
              <p className="text-gray-600 text-sm">
                Connect with others in your field — from medicine to mechanics.
                Share experiences and learn from peers worldwide.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <Globe className="w-10 h-10 mx-auto text-purple-500" />
            <div>
              <h3 className="text-xl font-semibold">Build a Digital Legacy</h3>
              <p className="text-gray-600 text-sm">
                Document your journey and showcase your growth to the world.
                Create a professional portfolio that grows with your career.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <Shield className="w-10 h-10 mx-auto text-red-500" />
            <div>
              <h3 className="text-xl font-semibold">Privacy First</h3>
              <p className="text-gray-600 text-sm">
                Control who sees your content. Share publicly or keep posts private.
                Your data is protected with industry-standard security.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <TrendingUp className="w-10 h-10 mx-auto text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Monitor your growth with built-in analytics. See your writing improve
                and your audience grow over time.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <BookOpen className="w-10 h-10 mx-auto text-indigo-500" />
            <div>
              <h3 className="text-xl font-semibold">Learn & Share</h3>
              <p className="text-gray-600 text-sm">
                Discover insights from professionals in your field. Share your
                knowledge and help others on their journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSection;
