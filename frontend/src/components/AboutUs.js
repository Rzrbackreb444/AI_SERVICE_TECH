import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            About LaundroTech
          </h1>
          <p className="text-2xl text-gray-300 font-medium">
            Location Intelligence, Forged in Fire
          </p>
        </motion.div>

        {/* Main Story */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20"
        >
          <div className="prose prose-lg prose-invert max-w-none">
            
            <p className="text-xl text-gray-200 leading-relaxed mb-8 font-medium">
              LaundroTech isn't some Silicon Valley fever dream cooked up by tech bros in hoodies who think "laundromat" is spelled with a "K." We're not venture-backed tourists playing dress-up in an industry they've never touched.
            </p>

            <p className="text-xl text-gray-200 leading-relaxed mb-8 font-medium">
              <strong className="text-blue-400">We're third-generation Arkansas iron.</strong> Bootstrapped, battle-tested, and built in the trenches where quarters matter and downtime kills.
            </p>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-8 border-l-4 border-blue-400">
              <p className="text-lg text-gray-200 leading-relaxed mb-4">
                I'm <strong className="text-blue-400">Nick Kremers</strong>, and commercial laundry isn't my side hustle—it's my bloodline.
              </p>
              
              <p className="text-lg text-gray-200 leading-relaxed">
                My grandfather, <strong>Jerry Kremers</strong>, was a Speed Queen distributor who owned laundromats when most people thought they were just coin-operated washing machines. I grew up riding shotgun in his truck, learning that every quarter told a story and every machine had a heartbeat.
              </p>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed mb-6">
              My father, <strong className="text-blue-400">Guy Kremers</strong>, carried that torch like his life depended on it—running Kremers Laundry Equipment Company, moving Dexter machines that weighed more than most cars, and teaching me that in this business, your reputation is built one bolt at a time.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-3">🔧 HANDS-ON MASTERY</h3>
                <p className="text-gray-300">Tearing down Maytag top loaders at 14, rebuilding them piece by piece until I could do it blindfolded</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-3">🎯 OBSESSIVE PRECISION</h3>
                <p className="text-gray-300">Taping, sanding, painting every panel until the finish was mirror-perfect—because details separate pros from pretenders</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-3">📊 OPERATOR WISDOM</h3>
                <p className="text-gray-300">Designing laundromats from scratch, calculating washer-to-dryer ratios that actually work in the real world</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-3">💪 UNSTOPPABLE GRIT</h3>
                <p className="text-gray-300">Moving 750-lb dryers solo off trailers because when the job needs doing, you find a way</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-8 mb-8 border-l-4 border-red-400">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Then Life Threw Everything At Me</h3>
              <p className="text-lg text-gray-200 leading-relaxed mb-4">
                <strong>2018.</strong> Massive hemorrhagic stroke. Half my body gone. Independence—gone. For a minute there, I thought everything I'd built, everything I knew, was finished.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed mb-4">
                But the day my son was born, staring at that perfect little face, I made a promise that would change everything:
              </p>
              <p className="text-xl font-bold text-orange-400">
                "I will rebuild. I will come back. And I will create something that matters."
              </p>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed mb-6">
              While clawing my way back to life, I started <strong className="text-blue-400">Laundromat Exchange</strong>—a community for operators who needed real talk about buying, selling, and surviving in this industry.
            </p>

            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 mb-8 border-l-4 border-green-400">
              <p className="text-lg text-gray-200 leading-relaxed font-medium">
                That community exploded to <strong className="text-green-400">67,000+ members</strong> because operators everywhere were starving for one thing: <strong>real intelligence from people who actually know this business.</strong>
              </p>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              But I kept seeing the same nightmare over and over: Good people—hardworking families—losing their life savings on locations that looked good on paper but were death traps in reality. Making million-dollar decisions with Google Street View and gut feelings.
            </p>

            <div className="text-center my-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                That's Why LaundroTech Exists
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded"></div>
            </div>

            <p className="text-xl text-gray-200 leading-relaxed mb-8 font-medium">
              We combine <strong className="text-blue-400">three generations of Arkansas expertise</strong> with <strong className="text-purple-400">cutting-edge AI</strong> to give operators, investors, and dreamers the weapons they need to:
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
                <h3 className="text-blue-400 font-bold text-lg mb-3">🎯 DOMINATE LOCATIONS</h3>
                <p className="text-gray-300">Find the goldmines before your competition even knows they exist</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-purple-400 font-bold text-lg mb-3">🔍 CRUSH COMPETITION</h3>
                <p className="text-gray-300">Analyze every rival with surgical precision and insider context</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/30">
                <h3 className="text-green-400 font-bold text-lg mb-3">💰 MAXIMIZE ROI</h3>
                <p className="text-gray-300">Turn data into dollars with strategies that actually work</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-8 mb-8 border border-gray-600">
              <p className="text-lg text-gray-200 leading-relaxed mb-4">
                We don't just crunch numbers like some Wall Street algorithm. <strong className="text-blue-400">We understand what those numbers mean when your kids' college fund is on the line.</strong>
              </p>
              <p className="text-lg text-gray-200 leading-relaxed">
                Every feature in LaundroTech answers the questions that keep operators awake at night—because we've been there, lost sleep over the same decisions, and lived to tell about it.
              </p>
            </div>

            <div className="text-center my-12">
              <h3 className="text-3xl font-bold text-gray-200 mb-6">We're Not Here to "Disrupt" Anything</h3>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                We're here to <strong className="text-blue-400">equip the warriors</strong> who run this industry—with intelligence that's as practical as a wrench and as powerful as experience itself.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">LaundroTech</h2>
              <div className="text-lg text-blue-100 space-y-2">
                <p><strong>Built in Arkansas.</strong></p>
                <p><strong>Backed by Three Generations.</strong></p>
                <p><strong>Powered by AI That Actually Understands.</strong></p>
              </div>
              <div className="mt-6">
                <p className="text-xl font-bold text-white">
                  Your Family's Future Shouldn't Rely on Guesswork.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Start Your Analysis Today
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutUs;