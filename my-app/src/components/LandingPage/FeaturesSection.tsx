import React, { useEffect } from "react";
import { Mail, Users, PenSquare, Globe } from "lucide-react";
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
                supported.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <Users className="w-10 h-10 mx-auto text-green-500" />
            <div>
              <h3 className="text-xl font-semibold">Find Your Community</h3>
              <p className="text-gray-600 text-sm">
                Connect with others in your field — from medicine to mechanics.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center space-y-4">
            <Globe className="w-10 h-10 mx-auto text-purple-500" />
            <div>
              <h3 className="text-xl font-semibold">Build a Digital Legacy</h3>
              <p className="text-gray-600 text-sm">
                Document your journey and showcase your growth to the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSection;
