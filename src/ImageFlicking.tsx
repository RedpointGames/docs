"use client";

import Flicking from "@egjs/react-flicking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { createRef, MouseEvent, useCallback } from "react";
import React from "react";

import "./css/flicking.css";

export interface ImageDefinition {
  url: string;
  altText: string;
}

export default function ImageFlicking({
  images,
}: {
  images: ImageDefinition[];
}) {
  "use client";

  const flicking = createRef<Flicking>();

  const onPrevious = useCallback(
    (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();
      if (!flicking.current?.animating) {
        flicking.current?.prev(100);
      }
    },
    [flicking]
  );

  const onNext = useCallback(
    (ev: MouseEvent<HTMLAnchorElement>) => {
      ev.preventDefault();
      if (!flicking.current?.animating) {
        flicking.current?.next(100);
      }
    },
    [flicking]
  );

  const imageRows: React.ReactNode[] = [];
  while (imageRows.length < 6) {
    for (const entry of images) {
      imageRows.push(
        <div
          className="flicking-item"
          style={{ position: "relative", width: "100%" }}
        >
          <img src={entry.url} key={imageRows.length} alt={entry.altText} />
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              borderRadius: "10px",
              maxWidth: "calc(100% - 20px)",
              padding: "4px 10px",
              backdropFilter: "blur(4px)",
              boxShadow: "2px 2px 10px #000",
            }}
          >
            {entry.altText}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="">
        <div className="carousel">
          <div className="carousel-arrow-left">
            <a
              href="#"
              className="button button--secondary vertical-align-icon"
              onClick={onPrevious}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </a>
          </div>
          <div className="carousel-content">
            <Flicking
              align={"prev"}
              ref={flicking}
              circular={true}
              interruptable={false}
              preventClickOnDrag={true}
              preventDefaultOnDrag={true}
              dragThreshold={40}
            >
              {imageRows}
            </Flicking>
          </div>
          <div className="carousel-arrow-right">
            <a
              href="#"
              className="button button--secondary vertical-align-icon"
              onClick={onNext}
            >
              <FontAwesomeIcon icon={faRightLong} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
