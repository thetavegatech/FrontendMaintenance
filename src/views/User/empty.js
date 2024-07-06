// ;<div className="card shadow-sm mx-auto" style={{ marginTop: '0.5rem', width: '1110px' }}>
//   <Link
//     to="/temperature"
//     style={{ position: 'absolute', top: '10px', right: '10px', overflow: 'hidden' }}
//   >
//     {/* Content inside Link */}
//   </Link>

//   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//     <div className="box d-flex justify-content-center align-items-center">
//       <MdDashboard
//         className="icon"
//         style={{
//           width: '30px',
//           height: '30px',
//           fill: 'white',
//           marginTop: '1px',
//           marginLeft: '3px',
//         }}
//       />
//     </div>
//   </div>

//   <div className="table-container">
//     <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
//       <div className="form-row1" style={{ marginLeft: '5px' }}>
//         {/* First Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="MachineName">Machine Name:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="MachineName"
//               name="MachineName"
//               value={formData.MachineName}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownStartDate">Breakdown Start Date:</label>
//             <input
//               type="date"
//               className="form-control"
//               id="BreakdownStartDate"
//               name="BreakdownStartDate"
//               value={formData.BreakdownStartDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="Shift">Shift:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="Shift"
//               name="Shift"
//               value={formData.Shift}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Second Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="LineName">Line Name:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="LineName"
//               name="LineName"
//               value={formData.LineName}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="Operations">Operations:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="Operations"
//               name="Operations"
//               value={formData.Operations}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownPhenomenon">Breakdown Phenomenon:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="BreakdownPhenomenon"
//               name="BreakdownPhenomenon"
//               value={formData.BreakdownPhenomenon}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Third Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownType">Breakdown Type:</label>
//             <select
//               className="form-control"
//               id="BreakdownType"
//               name="BreakdownType"
//               value={formData.BreakdownType}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select an option</option>
//               <option value="Mechanical">Mechanical</option>
//               <option value="Electrical">Electrical</option>
//               <option value="Electronic">Electronic</option>
//               <option value="Hydraulic">Hydraulic</option>
//               <option value="Pneumatic">Pneumatic</option>
//               <option value="Production Setting">Production Setting</option>
//             </select>
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownStartTime">Breakdown Start Time:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="BreakdownStartTime"
//               name="BreakdownStartTime"
//               value={formData.BreakdownStartTime}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownEndTime">Breakdown End Time:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="BreakdownEndTime"
//               name="BreakdownEndTime"
//               value={formData.BreakdownEndTime}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Fourth Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="BreakdownEndDate">Breakdown End Date:</label>
//             <input
//               type="date"
//               className="form-control"
//               id="BreakdownEndDate"
//               name="BreakdownEndDate"
//               value={formData.BreakdownEndDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="WhyWhyAnalysis">Why-Why Analysis:</label>
//             <input
//               type="textarea"
//               className="form-control"
//               id="WhyWhyAnalysis"
//               name="WhyWhyAnalysis"
//               value={formData.WhyWhyAnalysis}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="RootCause">Root Cause:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="RootCause"
//               name="RootCause"
//               value={formData.RootCause}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Fifth Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="TargetDate">Target Date:</label>
//             <input
//               type="date"
//               className="form-control"
//               id="TargetDate"
//               name="TargetDate"
//               value={formData.TargetDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="Responsibility">Responsibility:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="Responsibility"
//               name="Responsibility"
//               value={formData.Responsibility}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="HD">HD:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="HD"
//               name="HD"
//               value={formData.HD}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Sixth Row */}
//         <div
//           className="form-row"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             gap: '10px',
//             marginBottom: '20px',
//           }}
//         >
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="CounterMeasure">Counter Measure:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="CounterMeasure"
//               name="CounterMeasure"
//               value={formData.CounterMeasure}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group" style={{ width: '30%' }}>
//             <label htmlFor="ValidationResult">Validation Result:</label>
//             <input
//               type="text"
//               className="form-control"
//               id="ValidationResult"
//               name="ValidationResult"
//               value={formData.ValidationResult}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="form-group d-flex justify-content-center" style={{ marginTop: '3rem' }}>
//           {/* <button
//                 type="submit"
//                 className="btn btn-primary"
//                 style={{
//                   float: 'left',
//                   backgroundColor: '#CA226B',
//                   marginTop: '10px',
//                   alignItems: 'start',
//                   marginRight: '60rem',
//                 }}
//               >
//                 Save
//               </button> */}
//         </div>
//       </div>
//     </form>
//   </div>
// </div>
