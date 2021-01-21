function guardRoute(to, from, next)
{
 var isAuthenticated= false;
 if(localStorage.getItem('apollo-token'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
if(isAuthenticated) {
  next(); // allow to enter route
 } else{
  next('/login'); // go to '/login';
 }
}

export default guardRoute