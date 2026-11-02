
import { Component } from "react";
import Navbar from '../components/Navbar'
import {
  FiPlus,
  FiSearch,
  FiMoreHorizontal,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiArrowUpRight,
  FiCalendar,
  FiFolder,
} from "react-icons/fi";

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Dashboard extends Component {
  state = {
    searchInput: "",
    boards: [
      {
        id: 1,
        name: "Website Redesign",
        description: "Plan and manage the new website experience.",
        color: "bg-violet-500",
        members: 5,
        tasks: 24,
        completed: 15,
        date: "Nov 10, 2026",
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Track mobile application development tasks.",
        color: "bg-blue-500",
        members: 4,
        tasks: 32,
        completed: 18,
        date: "Nov 15, 2026",
      },
      {
        id: 3,
        name: "Marketing Campaign",
        description: "Organize campaigns and marketing activities.",
        color: "bg-pink-500",
        members: 6,
        tasks: 18,
        completed: 12,
        date: "Nov 18, 2026",
      },
      {
        id: 4,
        name: "Product Development",
        description: "Manage product features and improvements.",
        color: "bg-amber-500",
        members: 3,
        tasks: 20,
        completed: 8,
        date: "Nov 22, 2026",
      },
      {
        id: 5,
        name: "Bug Tracking",
        description: "Identify, prioritize and resolve bugs.",
        color: "bg-emerald-500",
        members: 4,
        tasks: 16,
        completed: 10,
        date: "Nov 25, 2026",
      },
      {
        id: 6,
        name: "Engineering Roadmap",
        description: "Plan upcoming engineering milestones.",
        color: "bg-indigo-500",
        members: 5,
        tasks: 28,
        completed: 14,
        date: "Nov 28, 2026",
      },
    ],
    apiStatus:apiStatusConstants.initial
  };

   componentDidMount(){
        this.setState({apiStatus:apiStatusConstants.inProgress})
        this.getList()
    }

    getList=async()=>{
        const url="http://localhost:3001/dashboard/tournaments"
        const response=await fetch(url)
        const data=await response.json()
        const convertedData=data.map(each=>({
            tournamentId:each.tournament_id,
            tournamentName: each.tournament_name,
            gameType:each.game_type,
            startDate:each.start_date,
            endDate:each.end_date,
            status:each.status
        }))
        if(response.ok===true){
            this.setState({list:convertedData,apiStatus:apiStatusConstants.success})
        }
        else{this.setState({apiStatus:apiStatusConstants.failure})}
    }

  onSearchChange = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  render() {
    const { searchInput, boards } = this.state;

    const filteredBoards = boards.filter((board) =>
      board.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <>
           <Navbar/>
           <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-sm font-medium text-violet-600 mb-2">
              WORKSPACE OVERVIEW
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Welcome back!
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Manage your projects and keep your team moving forward.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-violet-200 transition">
            <FiPlus className="text-lg" />
            Create New Board
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex justify-between items-center">
              <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-xl">
                <FiLayers />
              </div>
              <FiArrowUpRight className="text-slate-400 text-xl" />
            </div>
            <p className="text-sm text-slate-500 mt-5">Total Boards</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">12</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <p className="text-sm text-slate-500 mt-5">Total Tasks</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">138</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
              <FiUsers />
            </div>
            <p className="text-sm text-slate-500 mt-5">Team Members</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">24</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
              <FiClock />
            </div>
            <p className="text-sm text-slate-500 mt-5">Pending Tasks</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">42</h2>
          </div>
        </div>

        {/* Boards heading and search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Your Boards
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Access and manage your projects.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 sm:w-72">
            <FiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchInput}
              onChange={this.onSearchChange}
              className="w-full outline-none text-sm text-slate-700"
            />
          </div>
        </div>

        {/* Board cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBoards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${board.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  <FiFolder />
                </div>

                <button className="text-slate-400 hover:text-slate-700 p-2">
                  <FiMoreHorizontal className="text-xl" />
                </button>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mt-5">
                {board.name}
              </h3>

              <p className="text-sm text-slate-500 mt-2 min-h-10">
                {board.description}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-slate-700">
                    {Math.round((board.completed / board.tasks) * 100)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`${board.color} h-full rounded-full`}
                    style={{
                      width: `${(board.completed / board.tasks) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle />
                    {board.completed}/{board.tasks}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers />
                    {board.members}
                  </span>
                </div>

                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FiCalendar />
                  {board.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredBoards.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center mt-5">
            <FiSearch className="text-3xl text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">
              No boards found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try searching with a different board name.
            </p>
          </div>
        )}
           </div>
      </>
    );
  }
}

export default Dashboard;
