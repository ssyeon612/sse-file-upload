// interface IButtons {
//   buttonWrap: HTMLDivElement;
//   uploadBtn: HTMLButtonElement;
//   cancelBtn: HTMLButtonElement;
//   onClick: () => void;
//   handleCancel: () => void;
// }

// const Buttons = ({ buttonWrap, uploadBtn, cancelBtn, onClick, handleCancel }: IButtons) => {
//   return (
//     <div className="btn-wrap" ref={buttonWrap}>
//       <button className="upload-btn" onClick={onClick} ref={uploadBtn}>
//         <svg
//           className="w-6 h-6 text-gray-800 dark:text-white svg"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           fill="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             fillRule="evenodd"
//             d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
//             clipRule="evenodd"
//           />
//         </svg>
//         <span className="button__text">Upload File</span>
//       </button>
//       <button className="cancel-btn" ref={cancelBtn} onClick={handleCancel}>
//         <svg
//           className="w-6 h-6 text-gray-800 dark:text-white"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <path
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M6 18 17.94 6M18 18 6.06 6"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default Buttons;
