import type { MouseEventHandler } from "react";
import React, { useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { Button, Select, Upload } from "antd";
import ffmpeg from "fluent-ffmpeg";
import type { UploadChangeParam } from "antd/lib/upload";
import { ipcRenderer } from "electron";

function Home() {
  const options = [
    {
      value: "avi",
      label: "AVI",
    },
    {
      value: "flv",
      label: "FLV",
    },
    {
      value: "mkv",
      label: "MKV",
    },
    {
      value: "mov",
      label: "MOV",
    },
    {
      value: "mp4",
      label: "MP4",
    },
    {
      value: "wmv",
      label: "WMV",
    },
  ];

  const toFormat = useRef("");
  const scrPath = useRef("");

  const handleChange = (value: string) => {
    toFormat.current = value;
  };

  const handleClick: MouseEventHandler<HTMLElement> = () => {
    console.log("ok");
    ipcRenderer.send("convert", {
      srcPath: scrPath.current,
      format: toFormat.current,
    });
  };

  const handleChangeFile = (info: UploadChangeParam<UploadFile<any>>) => {
    scrPath.current = (info.file.originFileObj as any).path;
  };

  return (
    <div>
      <Upload onChange={handleChangeFile}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Select
        onChange={handleChange}
        style={{ width: 120 }}
        options={options}
      />
      <Button onClick={handleClick}>转化</Button>
    </div>
  );
}

export default Home;
