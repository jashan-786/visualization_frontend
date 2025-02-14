import React from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const Landing = () => {
  return (
    <div id="webcrumbs">
      <Header />
      <main className="p-10">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-neutral-950">
            Explore Connections Like Never Before
          </h2>
          <p className="text-neutral-600">
            Our platform enables you to visualize and make relationships in a
            dynamic way.
          </p>
        </section>
        <section className="flex justify-center mb-12">
          <div
            style={{ width: "800px", height: "400px", position: "relative" }}
            className="rounded-lg bg-neutral-100"
          >
            <div className="absolute w-full h-full flex justify-center items-center">
              <p className="text-neutral-500">
                <img src="./public/earth_2.jpg" alt="placeholder" />
              </p>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-neutral-50 rounded-md text-center shadow-sm">
            <i className="fa-solid fa-sitemap text-primary-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-bold mb-2 text-neutral-950">
              Dynamic Graphs
            </h3>
            <p className="text-neutral-600">
              Create and explore relationships tailored to your data needs.
            </p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-md text-center shadow-sm">
            <i className="fa-solid fa-chart-line text-primary-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-bold mb-2 text-neutral-950">
              Analytical Insights
            </h3>
            <p className="text-neutral-600">
              Leverage actionable insights with our detailed analytics.
            </p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-md text-center shadow-sm">
            <i className="fa-solid fa-lock text-primary-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-bold mb-2 text-neutral-950">
              Secure Tools
            </h3>
            <p className="text-neutral-600">
              Your data is safeguarded with industry-standard security measures.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
