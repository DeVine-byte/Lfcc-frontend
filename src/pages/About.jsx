import React from "react";

function About() {
  return (
    <div className="bg-black min-h-screen text-white">

      {/* NAVBAR */}
      <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="LFCC Logo"
              className="w-10 h-10 rounded-full"
            />

            <h1 className="text-purple-400 font-bold text-lg md:text-xl">
              Love Foundation Christian Center
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-zinc-300">
            <a href="/" className="hover:text-purple-400 transition">
              Home
            </a>

            <a href="/about" className="hover:text-purple-400 transition">
              About
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              const menu = document.getElementById("mobileMenuHome");
              menu.classList.toggle("hidden");
            }}
            className="md:hidden text-white text-3xl"
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        <div
          id="mobileMenuHome"
          className="hidden md:hidden flex flex-col gap-4 px-6 pb-4 text-zinc-300"
        >
          <a href="/" className="hover:text-purple-400 transition">
            Home
          </a>

          <a href="/about" className="hover:text-purple-400 transition">
            About
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-36 px-4 text-center overflow-hidden">

        <img
          src="/logo.png"
          alt="Background Logo"
          className="absolute opacity-5 w-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 max-w-3xl mx-auto">

          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            About Us
          </h1>

          <p className="text-zinc-400 text-lg leading-9 max-w-2xl mx-auto">
            Raising lives through the reality of God’s love,
            sound doctrine, discipleship and global ministry impact.
          </p>

        </div>
      </section>

      {/* MINISTERS */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-purple-400 mb-16">
            Ministers
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {/* Founder */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden text-center p-12 border border-zinc-800 hover:border-purple-500 transition">

              <img
                src="/founder.jpg"
                alt="Founder"
                className="w-44 h-44 mx-auto rounded-full object-cover border-4 border-purple-500"
              />

              <h3 className="text-2xl font-bold mt-8">
                Founder
              </h3>

              <p className="text-purple-400 mt-3">
                Rev. Osagie Daniel Erhabor
              </p>

              <p className="text-zinc-400 mt-5 text-sm leading-8">
                Vision bearer and spiritual founder of the ministry.
              </p>

            </div>

            {/* Head Pastor */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden text-center p-12 border border-zinc-800 hover:border-purple-500 transition">

              <img
                src="/headpastor.jpg"
                alt="Head Pastor"
                className="w-44 h-44 mx-auto rounded-full object-cover border-4 border-purple-500"
              />

              <h3 className="text-2xl font-bold mt-8">
                Head Pastor
              </h3>

              <p className="text-purple-400 mt-3">
                Pastor Emmanuel
              </p>

              <p className="text-zinc-400 mt-5 text-sm leading-8">
                Oversees teachings, sermons and spiritual direction.
              </p>

            </div>

            {/* Assistant Pastor */}
            <div className="bg-zinc-900 rounded-3xl overflow-hidden text-center p-12 border border-zinc-800 hover:border-purple-500 transition">

              <img
                src="/assitPastor.jpg"
                alt="Assistant Pastor"
                className="w-44 h-44 mx-auto rounded-full object-cover border-4 border-purple-500"
              />

              <h3 className="text-2xl font-bold mt-8">
                Assistant Pastor
              </h3>

              <p className="text-purple-400 mt-3">
                Pastor Justina
              </p>

              <p className="text-zinc-400 mt-5 text-sm leading-8">
                Supports administration and church operations.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ABOUT CARDS */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto grid gap-16">

          {/* Foundation */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-14">

            <h2 className="text-3xl font-bold text-purple-400 mb-8">
              Our Mission
            </h2>

            <p className="text-zinc-400 leading-9 max-w-3xl">
              Reaching every peoeple group with the love of God revealed in christ Jesus,
              winning souls amd making disciples that are exactly like him,
              to the the glory of God
            </p>

          </div>

          {/* Leadership */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-14">

            <h2 className="text-3xl font-bold text-purple-400 mb-8">
              Our Leadership
            </h2>

            <p className="text-zinc-400 leading-9 max-w-3xl">
              It was founded by Rev. Osagie Daniel Erhabor who is the
              Senior Pastor of the International Headquarters in Laurel,
              Maryland, Washington D.C., United States of America,
              where he pastors with his lovely wife Pastor Bridget
              and lives with his family.
              <br /><br />

              Osagie Daniel Erhabor, the President of Love Foundation
              International Inc. and his lovely wife Bridget, are
              seasoned ministers of the Gospel whose ministry has
              brought the reality of God’s love to the hearts of many.
            </p>

          </div>

          {/* Global Impact */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-14">

            <h2 className="text-3xl font-bold text-purple-400 mb-8">
              Global Impact
            </h2>

            <p className="text-zinc-400 leading-9 max-w-3xl">
              Their impact has led to the establishment of a number
              of Churches and Campus Fellowships worldwide that
              minister the reality of the Word of God to their
              community in truth and simplicity.
              <br /><br />

              Love Foundation is well known for the sincere love
              and anointing with which they minister the Word;
              thus bringing salvation, healing and deliverance
              to countless multitudes, and raising up ministers
              to carry the Gospel to all nations.
            </p>

          </div>

          {/* Journey */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-14">

            <h2 className="text-3xl font-bold text-purple-400 mb-8">
               Our Journey
            </h2>

            <p className="text-zinc-400 leading-9 max-w-3xl">
              Though the International Headquarters of the Ministry
              is currently located in Laurel, Maryland, United States
              of America, where Pastors Daniel and Bridget pastor,
              they are the founding pastors of the Nigeria
              Headquarters Church.
              <br /><br />

              They pastored it till 1996 when they relocated to
              the United States of America to pioneer the
              International Headquarters.
            </p>

          </div>

        </div>
      </section>

      {/* WORSHIP INVITATION */}
      <section className="pt-32 pb-28 px-4">

        <div className="max-w-6xl mx-auto mt-10 bg-gradient-to-r from-purple-900/40 to-zinc-900 border border-purple-500/30 rounded-3xl p-14 md:p-20 text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            We Invite You To Worship With Us
          </h2>

          <p className="text-zinc-300 leading-9 max-w-3xl mx-auto text-lg">
            Experience the love of God through heartfelt worship,
            sound teaching, prayer, fellowship and spiritual growth.
          </p>

        </div>
      </section>

      {/* SERVICE TIMES */}
      <section className="py-28 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-purple-400 mb-16">
            Service Times
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Sunday Services */}
            <div className="bg-zinc-900 rounded-3xl p-12 border border-zinc-800">

              <h3 className="text-2xl font-bold mb-8">
                Sunday Worship Services @ LFCC Benin
              </h3>

              <div className="space-y-8 text-zinc-400 leading-8">

                <div>
                  <p className="text-white font-semibold mb-2">
                    1st Service
                  </p>

                  <p>
                    7:30 AM – 9:00 AM
                  </p>
                </div>

                <div>
                  <p className="text-white font-semibold mb-2">
                    2nd Service
                  </p>

                  <p>
                    9:30 AM – 12:00 Noon
                  </p>
                </div>

              </div>

            </div>

            {/* Bible Study */}
            <div className="bg-zinc-900 rounded-3xl p-12 border border-zinc-800">

              <h3 className="text-2xl font-bold mb-8">
                 Wednesday Bible Study
              </h3>

              <div className="text-zinc-400 leading-8">

                <p className="text-white font-semibold mb-2">
                  Bible Study Service
                </p>

                <p>
                  5:00 PM – 6:30 PM
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="pt-32 pb-28 px-4">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-purple-400 mb-16">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            {/* Address */}
            <div className="bg-zinc-900 rounded-3xl p-12 border border-zinc-800 text-center">

              <h3 className="text-2xl font-semibold mb-6">
                📍 Address
              </h3>

              <p className="text-zinc-400 leading-9">
                #33, 1st Isibor Street,
                <br />
                Off Sunny Way,
                <br />
                Upper Uwa Street,
                <br />
                Benin City
              </p>

            </div>

            {/* Phone */}
            <div className="bg-zinc-900 rounded-3xl p-12 border border-zinc-800 text-center">

              <h3 className="text-2xl font-semibold mb-6">
                📞 Phone
              </h3>

              <p className="text-zinc-400 leading-9">
                +234-703-6730-005
                <br />
                +234-805-662-3094
              </p>

            </div>

            {/* Email */}
            <div className="bg-zinc-900 rounded-3xl p-12 border border-zinc-800 text-center">

              <h3 className="text-2xl font-semibold mb-6">
                ✉️ Email
              </h3>

              <a
                href="mailto:info@lovefoundationng.org"
                className="text-purple-400 hover:underline break-words"
              >
                info@lovefoundationng.org
              </a>

            </div>
            {/* WEBSITE CTA */}
            <section className="py-24 text-center px-4">

              <h2 className="text-3xl font-bold mb-6">
                Visit Our Official Website
              </h2>

              <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
                Stay connected with our ministry, programs, teachings,
                events and community outreach activities.
              </p>

              <a
                href="https://lovefoundationng.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 transition px-8 py-4 rounded-2xl font-semibold text-lg"
              >
                Visit Website
              </a>

            </section>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
