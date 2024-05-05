import React from "react";

import { Table } from "antd";
import Image from "next/image";
const { Column } = Table;

const index = () => {
  const data = [
    {
      key: "1",
      option: "Bulk Packaging",
      image: "",
      size: "380 x 290 x 300mm\n27 such cartons = 1 cubic metre",
      quantities:
        "Wing Caps – 300 (short reac)\nWing Caps – 250 (long reach)\nRound caps – 200\nSD1/2 – 500",
    },
    {
      key: "2",
      option: "Individual Sealed Bag",
      image: "/img/package1.jpg",
      size: "	Small 6 x 4″\nMedium 7 x 5″\nLarge 9 x 7″\nAll 400 gauge",
      quantities: "Small – 175 box\nMedium – 150 box\nLarge – 50 box",
    },
    {
      key: "3",
      option: "Presco design boxes – Box with label in Presco or Own branding",
      image: "/img/package2.jpeg",
      size:
        "Small – 55mm H x 55mm W x 30mm D\nMedium – 65mm H x 65mm W x 36mm D\nLarge – 88mm H x 88mm W x 50mm D",
      quantities: "Small x 350 qty\nMedium x 180 qty\nLarge x 60 qty",
    },
    {
      key: "4",
      option: "Blister Packs with Presco insert label or Own label",
      image: "/img/package3.jpeg",
      size:
        "Small – To fit Small Japanese caps\nLarge – To fit Wing or Plastic\nAutomotive Caps",
      quantities: "Small x 175 qty\nLarge x 100 qty",
    },
    {
      key: "5",
      option: "Box dimension for shipping",
      image: "/img/package4.jpeg",
      size: "New York No. 1 Lake Park",
      quantities:
        "10 boxes per pallet row\n5 rows per pallet\nmaximum\n50 boxes total",
    },
  ];
  return (
    <div className="container mx-auto py-16 px-6 md:px-4">
      <div className="flex mb-2 ">
        <h3>Packaging</h3>
        <div className="flex-auto ml-4">
          <div
            className="border-t-2 border-grey-500 relative top-1/2"
            style={{ top: "50%" }}
          ></div>
        </div>
      </div>
      <div className="text-sm text-blue-700">
        <Table dataSource={data} pagination={false} bordered>
          <Column
            title="Option No."
            dataIndex="option"
            key="option"
            render={(text, record, index) => (
              <span>
                {index + 1}. {text}
              </span>
            )}
          />
          <Column
            title="Image"
            dataIndex="image"
            key="image"
            render={(text) => (
              <Image src={text} alt="img" width={237} height={172} />
            )}
          />
          <Column
            title="Size"
            dataIndex="size"
            key="size"
            render={(text) => (
              <div style={{ whiteSpace: "pre-line" }}>{text}</div>
            )}
          />
          <Column
            title="Carton Quantities"
            dataIndex="quantities"
            key="quantities"
            render={(text) => (
              <div style={{ whiteSpace: "pre-line" }}>{text}</div>
            )}
          />
        </Table>
        <div className="border px-6 py-6 mt-12 text-blue-800 font-bold">
          <p className="py-8 ">
            Note: For export shipping 1 cubic metre is the minimum order.
          </p>
          <p>This may be for mixed reference quantities</p>
        </div>
      </div>
    </div>
  );
};

export default index;
