import Footer from "./components/Footer";
import Header from "./components/Header";

export const Landing = () => {
  return (
    <div id="webcrumbs">
      <Header />
      <main className="p-4 sm:p-6 md:p-10">
        <section className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-neutral-950">
            Explore Connections Like Never Before
          </h2>
          <p className="text-neutral-600 text-sm  p-4">
            Our platform enables you to visualize and make relationships in a
            dynamic way.
          </p>
        </section>
        <section className="flex justify-center mb-8 md:mb-12">
          <div
            style={{ maxWidth: "800px", height: "300px", position: "relative" }}
            className="w-full md:h-[400px] rounded-lg bg-neutral-100"
          >
            <div className="absolute w-full h-full flex justify-center items-center">
              <p className="text-neutral-500">
                <img src="/earth_2.jpg" alt="placeholder" className="max-w-full max-h-full object-contain" />
              </p>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
