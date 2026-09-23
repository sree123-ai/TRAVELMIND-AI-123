import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AIChatbot } from '../components/AIChatbot';
import { ArrowLeft, Calendar, Clock, MapPin, Coffee, Camera, Sunset, Sparkles, CheckCircle2 } from 'lucide-react';

export const Itinerary = () => {
  const { t } = useLanguage();
  const { tripData } = useAuth();

  const days = [
    {
      day: "DAY 1",
      theme: "Arrival, Mist & Tea Garden Sunset",
      items: [
        { time: "09:30 AM", title: "Arrival & Scenic Hill Drive", desc: "Arrive via Kochi/Aluva ghat road with photo stops at Cheeyappara Waterfalls.", icon: "🚗" },
        { time: "12:30 PM", title: "Resort Check-in & Authentic Kerala Lunch", desc: "Relax and savor traditional Kerala vegetarian feast with Appam & vegetable stew.", icon: "🍴" },
        { time: "03:30 PM", title: "Tea Museum & Heritage Tasting", desc: "Explore century-old CTC roller machines and taste fresh golden pekoe brew.", icon: "☕" },
        { time: "06:00 PM", title: "Lockhart Gap Sunset Viewpoint", desc: "Enjoy panoramic sunset over the rolling tea valleys with cool evening breeze.", icon: "🌄" }
      ]
    },
    {
      day: "DAY 2",
      theme: "Wildlife Exploration & Lake Boating",
      items: [
        { time: "07:30 AM", title: "Eravikulam National Park Safari", desc: "Early morning bus tour to spot Nilgiri Tahr and wild mountain orchids.", icon: "🐘" },
        { time: "11:30 AM", title: "Mattupetty Dam & Speed Boating", desc: "Family-friendly boat ride surrounded by emerald hills and eucalyptus groves.", icon: "🚤" },
        { time: "02:00 PM", title: "Echo Point Walk & Spice Shopping", desc: "Test the natural acoustic echo and buy certified organic cardamom and cloves.", icon: "🛍️" },
        { time: "05:00 PM", title: "Kundala Lake Pedal Boating", desc: "Serene pedal boating on historical arch dam lake amidst blossoming cherry trees.", icon: "🚣" }
      ]
    },
    {
      day: "DAY 3",
      theme: "Peak Vistas & Return Journey",
      items: [
        { time: "08:30 AM", title: "Top Station Viewpoint", desc: "Highest elevation point on the Munnar-Kodaikanal road with cloud canopy views.", icon: "☁️" },
        { time: "11:30 AM", title: "Marayoor Sandalwood & Jaggery Village", desc: "Experience natural sandalwood reserves and traditional cane jaggery making.", icon: "🌿" },
        { time: "02:30 PM", title: "Farewell Lunch & Return Departure", desc: "Head back comfortably with memorable experiences and fresh mountain tea.", icon: "✨" }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-6 px-4 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/recommendations"
          className="btn-3d px-4 py-2 bg-cream-100 text-textBrown font-bold text-xs sm:text-sm flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="parchment-panel p-6 sm:p-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tourGold border-2 border-borderBrown shadow-[0_2px_0_#5A2B15] mb-2">
          <Sparkles className="w-4 h-4 text-tourOrange" />
          <span className="font-extrabold text-xs text-textBrown">AI DYNAMIC ITINERARY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-textBrownDark">
          ✨ Munnar 3-Day Personalized Itinerary
        </h1>
        <p className="text-xs sm:text-sm text-textBrown/80 font-bold max-w-xl mx-auto mt-2">
          Custom pacing calibrated for family safety, age comfort, and optimal travel timings.
        </p>
      </div>

      {/* Day by Day Cards */}
      <div className="space-y-6">
        {days.map((d, dIdx) => (
          <div key={dIdx} className="parchment-panel p-6 sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-borderBrown/20 pb-3 mb-4">
              <div>
                <span className="text-xs font-black text-tourOrange uppercase tracking-wider block">
                  {d.day}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-textBrownDark">{d.theme}</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-tourGold border-2 border-borderBrown flex items-center justify-center font-black text-sm shadow-[0_2px_0_#5A2B15]">
                #{dIdx + 1}
              </div>
            </div>

            <div className="space-y-3.5">
              {d.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="p-4 rounded-xl bg-cream-100 border-2 border-borderBrown shadow-[0_3px_0_#5A2B15] flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-borderBrown flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_2px_0_#5A2B15]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-tourOrange text-white">
                        {item.time}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-textBrownDark">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-textBrown/80 font-semibold mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot */}
      <AIChatbot tripContext={tripData} />
    </div>
  );
};
