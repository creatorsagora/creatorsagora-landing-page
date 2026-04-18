const featureRows = [
  {
    title: "See momentum before spend slips.",
    label: "Live Reach",
    description:
      "Track reach and engagement in one motion so the team can spot lift early, tighten weak campaigns, and move budget with more confidence.",
    points: ["Daily campaign trendlines", "Reach and engagement in one view", "Faster mid-flight decisions"],
    image: "/feature-reach-engagement.png",
    imageAlt: "Reach and engagement analytics chart",
    imageLeft: true
  },
  {
    title: "Know which channels are carrying the launch.",
    label: "Channel Mix",
    description:
      "Read platform distribution at a glance and rebalance creator output faster when one channel starts pulling ahead of the rest.",
    points: ["Clear platform share", "Cleaner planning across channels", "Sharper reporting for every launch"],
    image: "/feature-channel-performance.png",
    imageAlt: "Channel performance mix chart",
    imageLeft: false
  }
];

export function FeaturesSection() {
  return (
    <section className="pro-section py-12 md:py-16" id="features">
      <div className="pro-container">
        <div className="space-y-12 md:space-y-16">
          {featureRows.map((feature) => (
            <article
              className="grid items-center gap-8 border-t border-black/8 pt-10 md:gap-10 md:pt-12 lg:grid-cols-2 lg:gap-14"
              key={feature.title}
            >
              <div className={feature.imageLeft ? "order-1" : "order-2 lg:order-2"}>
                <img
                  alt={feature.imageAlt}
                  className="block w-full rounded-[24px] border border-[#272543] shadow-[0_24px_60px_rgba(17,17,17,0.14)]"
                  loading="lazy"
                  src={feature.image}
                />
              </div>

              <div
                className={`flex max-w-[540px] flex-col ${
                  feature.imageLeft ? "order-2 lg:pl-2" : "order-1 lg:pr-2"
                }`}
              >
                <span className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6b6459]">
                  {feature.label}
                </span>
                <h2 className="mt-4 font-display text-[clamp(2rem,3.8vw,3.45rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#111111]">
                  {feature.title}
                </h2>
                <p className="mt-5 text-[clamp(1rem,1.45vw,1.12rem)] leading-[1.8] text-[#554f44]">
                  {feature.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {feature.points.map((point) => (
                    <span
                      className="inline-flex min-h-[40px] items-center rounded-[8px] border border-black/10 bg-white/68 px-3 py-2 text-[0.92rem] font-semibold text-[#23211d]"
                      key={point}
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
