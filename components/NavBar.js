import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";

const NavBar = () => {

  const { data: session } = useSession()
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // console.log("signed out")
    router.push("/");
  };

  return (
    <nav
        className="navbar"
        role="navigation"
        aria-label="main navigation"
        style={{ backgroundColor: "#28CCFF" }}
      >
      
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item" style={{ color: "#000000" }}>
            Pizza Police
          </a>
        </Link>
      </div>

      {
        session ? 
        <Link href="/app/home">
          <a className="navbar-item" style={{ color: "#000000" }}>Admin View</a>
        </Link> : null
      }

      <div className="navbar-menu">
        <div className="navbar-start"></div>
      </div>

      { session ? 
          <div className="header-container">
            <a className="black-text">{`Signed in as ${session.user.name}`}</a>
            <button className="orange-button" onClick={handleSignOut}>Sign out</button>
          </div>
         : 
          <div className="header-container">
              <button className="orange-button" onClick={() => signIn()}>Sign In</button>
          </div>
      }
    </nav>
  );
};

export default NavBar;
