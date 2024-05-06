import React from "react";

import Image from "next/image";

const index = () => {
  return (
    <div className="container mx-auto py-16 px-6 md:px-4">
      <div className="w-full border px-4 py-5 text-blue-900 text-sm bg-slate-200">
        <p className="py-2">
          Presco is certified to the standard & guidelines of ISO 9001:2015. See
          our current certification.
        </p>
        <p className="py-2">
          Our Pnuetek FC0750 Pressure & Leak Testing Machine uses state of the
          art testing equipment to measure both the radiator cap pressure &
          valve leak to 100th of one PSI.
          <br />
          We have a second electronic pressure testing machine, our J.M.Bodley
          tester, with a comprehensive range of compatible test pots, for our
          range of expansion tank pressure caps.
        </p>

        <p className="py-2">
          Presco follows extensive testing procedures for all its clients, and
          for some, all radiator caps are 100% pressure and leak tested.
        </p>
        <p className="py-2">
          Presco has recently introduced a new water testing facility, for
          further extensive testing of our metal & expansion tank caps.
        </p>
        <p className="py-2">
          Using these machines Presco is able to provide the customer with
          detailed testing results so they may be confident that the supplied
          product is of perfect quality.
          <br />
          This will be achieved through continued improvement and investment in
          new technology, machinery, training and at all times following the
          policies set down and procedures laid out in our quality manual and in
          accordance with the ANSI SAE J164 international standards.
        </p>
      </div>
      <div className="wrap-inspection flex flex-col md:grid grid-cols-3 gap-12 my-16 auto-cols-max">
        <div className="flex justify-center">
          <Image
            className="object-cover"
            src="/img/testing.png"
            alt="img"
            width={355}
            height={293}
          />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing1.png" alt="img" width={355} height={293} />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing2.png" alt="img" width={355} height={293} />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing3.png" alt="img" width={355} height={293} />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing4.png" alt="img" width={355} height={293} />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing5.png" alt="img" width={355} height={293} />
        </div>
        <div className="flex justify-center items-start">
          <Image
            className="object-contain"
            src="/img/testing6.png"
            alt="img"
            width={355}
            height={293}
          />
        </div>
        <div className="flex justify-center">
          <Image src="/img/testing7.png" alt="img" width={355} height={407} />
        </div>
      </div>
    </div>
  );
};

export default index;
