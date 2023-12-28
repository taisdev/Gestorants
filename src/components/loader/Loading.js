import React from "react";
import loaderImg from "../../assets/loading.gif";
import styles from "./Loading.module.scss";
import ReactDOM from "react-dom";

const Loading = () => {
    return ReactDOM.createPortal(
        <div className={styles.wrapper}>
            <div className={styles.loader}>
                <img src={loaderImg} alt="loading" />
            </div>
        </div>,
        document.getElementById("loader")
    );
};

export default Loading;
