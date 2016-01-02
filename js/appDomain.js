/*<app>
	<users>

		<user>
			<user_data id='' type='' first_name='' last_name='' email='' password='' picture_url=''/>
			
			<instructor>
				<insctuctor_bio=''/>
				<instructor_courses>
					<instructor_course id=''/>

				</instructor_courses>
			</instructor>

			<student>
				<student_courses>
					<student_course id='' progress=''/>
					...
				</student_courses>
				<starred_courses>
					<starred_course id= ''/>
					...
				</starred_courses>
				//todo:friends, badges
			</student>

		</user>
		
		...

	</users>
	
	<categories>
		<category name=''/>
	</categories>

	<courses>
		<course>
			<course_data id='' category='' title='' description='' skill_level='' duration='' instructor_id=''/>
			<lectures>
				<lecture>
					<lecture_data number='' title='' description='' video_url=''/>
					//todo:evaluation, support materials
				</lecture>
				...
			</lectures>
			//todo:rating, comments
		</course>
		
		...
	
	</courses>

	<current_user id='-1'/>

	</app>*/


/*****************************************************************************************
***********************************     INIT    ****************************************
*****************************************************************************************/

function loadAll() {
	$("#register").load("fp-registar.html");
	$("#login").load("fp-entrar.html");
	updateNavbar();
}

var dbInit ="\
<app>\
<users></users>\
<categories>\
<category name='Culinária'></category>\
<category name='Finanças'></category>\
<category name='Línguas'></category>\
<category name='Saúde'></category>\
<category name='Tecnologia'></category>\
</categories>\
<courses></courses>\
<current_user id='none'></current_user>\
</app>";



/*****************************************************************************************
********************************     DATABASE TOOLS    ***********************************
*****************************************************************************************/

function xmlToString(xmlDoc) { 
	//code for IE
	if (window.ActiveXObject) {
		var xmlString = xmlDoc.xml; return xmlString;
	} 
	// code for Chrome, Safari, Firefox, Opera, etc.
	else {
		return (new XMLSerializer()).serializeToString(xmlDoc);
	}
}

function stringToXml(xmlString) {
	//code for IE
	if (window.ActiveXObject) { 
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); xmlDoc.loadXML(xmlString);
		return xmlDoc;
	}
	// code for Chrome, Safari, Firefox, Opera, etc. 
	else {
		return (new DOMParser()).parseFromString(xmlString, "text/xml");
	}
}

function load() {
	var xmlDoc;
	var xmlString = localStorage.getItem("eSeniorDatabase");
	if (xmlString == null || xmlString == "") {
		xmlDoc = stringToXml(dbInit);
	}
	else {
		xmlDoc = stringToXml(xmlString);
	}
	return xmlDoc.getElementsByTagName("app")[0];
}

function store(xmlDoc) {
	var xmlString = xmlToString(xmlDoc);
	localStorage.setItem("eSeniorDatabase", xmlString);	

	alert(xmlString);
}

function reset() {
	localStorage.setItem("eSeniorDatabase", "");
}

/*****************************************************************************************
***********************************     DOMAIN    ****************************************
*****************************************************************************************/

function loginUser() {
	var inputEmail=document.getElementById("LoginInputEmail").value;
	var inputPassword=document.getElementById("LoginInputPassword").value;


	var xmlDoc = load();

	var users = xmlDoc.getElementsByTagName("users")[0];
	var usersNodes = users.childNodes;

	//check if user already exists
	for (var i = 0; i < usersNodes.length; i++) {
		userData = usersNodes[i].getElementsByTagName("user_data")[0];
		var email = userData.getAttribute("email");
		var password = userData.getAttribute("password");
		if(email == inputEmail && password == inputPassword) {
			var id = userData.getAttribute("id");
			var currentUser = xmlDoc.getElementsByTagName("current_user")[0];
			currentUser.setAttribute("id", id);
			store(xmlDoc);
			return;
		}
	}
	alert("wrong");
}

function logoutUser() {
	var xmlDoc = load();
	var currentUser = xmlDoc.getElementsByTagName("current_user")[0];
	currentUser.setAttribute("id", "none");
	store(xmlDoc);
	updateNavbar();
}

function userLoggedIn() {
	var xmlDoc = load();
	var currentUser = xmlDoc.getElementsByTagName("current_user")[0];
	return currentUser.getAttribute("id") != "none";
}

function getCurrentUser() {
	var xmlDoc = load();
	var currentUser = xmlDoc.getElementsByTagName("current_user")[0];
	var users = xmlDoc.getElementsByTagName("users")[0];
	var usersNodes = users.childNodes;

	for (var i = 0; i < usersNodes.length; i++) {
		userData = usersNodes[i].getElementsByTagName("user_data")[0];
		if(userData.getAttribute("id") == currentUser.getAttribute("id")) {
			return userData;
		}
	}
	return null;
}


function registerUser() {
	//retrieve input fields
	var inputFirstName=document.getElementById("RegisterInputFirstName").value;
	var inputLastName=document.getElementById("RegisterInputLastName").value;
	var inputEmail=document.getElementById("RegisterInputEmail").value;
	var inputPassword=document.getElementById("RegisterInputPassword").value;


	var xmlDoc = load();
	var users = xmlDoc.getElementsByTagName("users")[0];
	var usersNodes = users.childNodes;

	//check if user already exists
	for (var i = 0; i < usersNodes.length; i++) {
		userData = usersNodes[i].getElementsByTagName("user_data")[0];
		var email = userData.getAttribute("email");
		if(email == inputEmail) {
			alert("user already registered");
			return;
		}
	}

	//create user
	var user = document.createElement("user");
	var userData = document.createElement("user_data");
	//set attributes
	userData.setAttribute("id", "USER"+usersNodes.length);
	//userData.setAttribute("type", inputType);
	userData.setAttribute("first_name", inputFirstName);
	userData.setAttribute("last_name", inputLastName);
	userData.setAttribute("email", inputEmail);
	userData.setAttribute("password", inputPassword);
	//userData.setAttribute(pictureUrl, someurl);
	//set user
	user.appendChild(userData);
	users.appendChild(user);

	store(xmlDoc);
}


function createCourse() {
	//retrieve input fields
	var inputCourseTitle=document.getElementById("InputCourseTitle").value;
	var inputCategory=document.getElementById("categoryPicker").getAttribute("name");
	var inputCourseDescription=document.getElementById("InputCourseDescription").value;


	var xmlDoc = load();
	var courses = xmlDoc.getElementsByTagName("courses")[0];
	var coursesNodes = courses.childNodes;

	//create course
	var course = document.createElement("course");
	var courseData = document.createElement("course_data");
	//set attributes
	courseData.setAttribute("id", "COURSE"+coursesNodes.length);
	courseData.setAttribute("category", inputCategory);
	courseData.setAttribute("title", inputCourseTitle);
	courseData.setAttribute("description", inputCourseDescription);
	//set course
	course.appendChild(courseData);
	courses.appendChild(course);

	store(xmlDoc);
}

function getCourseById(courseId) {
	var xmlDoc = load();
	var courses = xmlDoc.getElementsByTagName("courses")[0];
	var coursesNodes = courses.childNodes;

	for (var i = 0; i < coursesNodes.length; i++) {
		var courseData = coursesNodes[i].getElementsByTagName("course_data")[0];
		if(courseData.getAttribute("id") == courseId) {
			return courseData;
		}
	}
	return null;	
}


/*****************************************************************************************
*******************************     DYNAMIC HTML    **************************************
*****************************************************************************************/

function updateNavbar() {
	var leftLink = document.getElementById("navbarButtonLeft");
	var rightLink = document.getElementById("navbarButtonRight");
	if (userLoggedIn()) {
		leftLink.setAttribute("href", "fp-perfil.html");
		leftLink.removeAttribute("data-toggle");
		leftLink.removeAttribute("data-target");
		leftLink.innerHTML = "Olá, "+ getCurrentUser().getAttribute("first_name");  

//NOT WORKING
rightLink.setAttribute("href", "fp-index.html");
rightLink.setAttribute("data-toggle","");
rightLink.setAttribute("data-target","");
rightLink.setAttribute("onclick", "logoutUser()");
rightLink.innerHTML = "Sair";

$("#profileNav").show();

}else {

	leftLink.setAttribute("href", "#");
	leftLink.setAttribute("data-toggle", "modal");
	leftLink.setAttribute("data-target", "#registerNorm");
	leftLink.innerHTML = "Registar";

	rightLink.setAttribute("href", "#");
	rightLink.setAttribute("data-toggle", "modal");
	rightLink.setAttribute("data-target", "#loginNorm");
	rightLink.removeAttribute("onclick");
	rightLink.innerHTML = "Entrar";

	$("#profileNav").hide();
}
}


function updateProfile() {
	var name = document.getElementById("userName");
	var email = document.getElementById("userEmail");
	
	name.innerHTML = getCurrentUser().getAttribute("first_name") + " " + getCurrentUser().getAttribute("last_name");
	email.innerHTML = getCurrentUser().getAttribute("email");  
}


var activeCategory = "Todos";

function loadCategories() {
	var sideBarCategories = document.getElementById("categories");

	var xmlDoc = load();
	var categories = xmlDoc.getElementsByTagName("category");

	//list categories on sidebar

	for (var i = 0; i < categories.length; i++) {
		var liTag = document.createElement("li");
		var aTag = document.createElement("a");
		var name = categories[i].getAttribute("name");
		aTag.innerHTML = name;
		//aTag.href="#";
		liTag.appendChild(aTag);
		liTag.setAttribute("id", name);
		liTag.setAttribute("onclick", "setActiveCategory(this.id)");
		sideBarCategories.appendChild(liTag);
	}
}

function setActiveCategory(categoryName) {
	var category = document.getElementById(activeCategory);
	category.setAttribute("class", "inactive");

	category = document.getElementById(categoryName);
	category.setAttribute("class", "active");

	loadCourses(categoryName);


	activeCategory = categoryName;

}

function loadCourses(categoryName) {
	$('#courses').empty();
	var coursesDiv = document.getElementById("courses");
	var categoryDiv = document.createElement("div");
	coursesDiv.appendChild(categoryDiv);
	categoryDiv.setAttribute("class", "row");

	categoryDiv.innerHTML="\
	<div class='col-lg-12'>\
	<h1 class='page-header'>"+categoryName+"</h1>\
	</div>";


	var xmlDoc = load();
	var courses = xmlDoc.getElementsByTagName("courses")[0];
	var coursesNodes = courses.childNodes;


	//load all courses from that category
	for (var i = 0; i < coursesNodes.length; i++) {
		courseData = coursesNodes[i].getElementsByTagName("course_data")[0];
		courseCategory = courseData.getAttribute("category");
		courseId = courseData.getAttribute("id");
		if (courseCategory == categoryName) {
			loadCoursesThumbnails(categoryDiv, courseId);
		}
	}
}

function loadCoursesThumbnails(categoryDiv, courseId) {
	var courseThumbnail = document.createElement("div");
	var thumbId = "courseThumb"+courseId;
	categoryDiv.appendChild(courseThumbnail);

	var course = getCourseById(courseId);
	courseThumbnail.innerHTML ="\
	         <div class='col-md-4 portfolio-item' >\
                <a href='fp-curso-exemplo.html'>\
                    <img class='img-responsive' src='./img/course8.png' alt=''/>\
                </a>\
                <h3>\
                    <a href='fp-curso-exemplo.html'>"+course.getAttribute("title")+"</a>\
                </h3>\
                <p>"+course.getAttribute("description")+"</p>\
            </div>";
}




function loadCategoriesIntoDropdown() {
	var dropDownCategories = document.getElementById("dropDownCategories");
	$('#dropDownCategories').empty();

	var xmlDoc = load();
	var categories = xmlDoc.getElementsByTagName("category");

	//list categories on sidebar

	for (var i = 0; i < categories.length; i++) {
		var liTag = document.createElement("li");
		var aTag = document.createElement("a");
		var name = categories[i].getAttribute("name");
		aTag.innerHTML = name;
		aTag.href="#";
		liTag.appendChild(aTag);
		liTag.setAttribute("id", name);   
		liTag.setAttribute("onclick", "selectCategory(this.id)");
		dropDownCategories.appendChild(liTag);
	}
}

function selectCategory(name) {
	categoryPicker = document.getElementById("categoryPicker");
	categoryPicker.innerHTML = name + "<span class='caret'></span>";
	categoryPicker.setAttribute("name", name);
}


function test() {
	alert("test");
}