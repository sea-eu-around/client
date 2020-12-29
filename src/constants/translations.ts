import {MIN_PASSWORD_LENGTH} from "../validators";

export default {
    en: {
        locales: {
            en: "English",
            fr: "French",
        },
        appName: "SEA-EU Around",
        welcome: "Welcome",
        // Component-related
        picker: {
            callToAction: "Select (%d selected)",
        },
        login: "Log in",
        tabsignin: "Log in",
        tabsignup: "Sign up",
        emailAddress: "Email address",
        password: "Password",
        passwordRepeat: "Repeat password",
        send: "Send",
        forgotPassword: "Forgot Password",
        newPassword: "New Password",
        forgotPasswordExplanation:
            "Enter the email address associated with your account below. Instructions for choosing a new password will be sent shortly.",
        cancel: "Cancel",
        ok: "OK",
        signupWelcome: "We can't wait for you to join our community!",
        save: "Save",
        firstname: "First name",
        lastname: "Last name",
        noResultsFound: "No results found",
        legal: {
            modal: {
                disclaimer1:
                    "Please understand that you will not be able to use our services if you decide to decline the terms of service.",
                disclaimer2: "Declining will abort the profile creation process.",
            },
            decline: "Decline",
            accept: "Accept",
            readMore: ["Read more about our terms & conditions ", "here", "."],
        },
        privacy: {
            readMore: ["Read more about our privacy policy ", "here", "."],
        },
        emailNotificationsLabel: "Send me useful notifications by email.",
        emailValidation: {
            validating: "Validating",
            success: ["Your account has been validated! You may now ", "log in"],
        },
        createAccount: "Create account",
        validation: {
            required: "Required field.",
            atLeastOne: "Please select at least one.",
            addAtLeastOne: "Please add at least one.",
            email: {
                invalid: "Please provide a valid email address.",
                invalidDomain: "Your email address must match one of our partner universities.",
            },
            password: {
                tooShort: `Your password must have at least ${MIN_PASSWORD_LENGTH} characters.`,
                noDigit: "Your password must contain at least one digit.",
                noUpperCase: "Your password must contain at least one upper case character.",
                noLowerCase: "Your password must contain at least one lower case character.",
                noSymbol: "Your password must contain at least one symbol (#@$!%*?&).",
                repeatWrong: "These passwords don't match.",
            },
            language: {
                atLeastOne: "Please select at least one language.",
                specifyLevel: "Please specify a level for your languages.",
            },
            date: {
                tooYoung: "You must be 16 or older to join this platform.",
                invalid: "Please enter a valid date.",
            },
        },
        error: {
            error_user_not_verified: "This account's email address has not been verified yet.",
            user_not_found: "User not found.",
            email_or_password_incorrect: "Incorrect email or password.",
            reset_password_no_token: "Could not fulfill this request.",
            unique: {
                user: {
                    email: "This email address is already in use.",
                },
            },
            validation: {
                email: {
                    is_email: "Please provide a valid email address.",
                },
            },
        },
        pageNotFound: "404: Page not found.",
        pageDoesntExist: "This page doesn't exist.",
        goHome: "Go to home screen",
        tabs: {
            home: "Home",
            matching: "Matching",
            messaging: "Messaging",
            notifications: "Notifications",
        },
        myProfile: "My Profile",
        editProfile: "Edit profile",
        educationFieldsPicker: {
            placeholder: "Select fields",
            searchPlaceholder: "Search",
            multiple: "%d selected",
        },
        educationFieldCategories: {
            "generic-programmes-qualifications": "Generic programmes and qualifications",
            education: "Education",
            "arts-humanities": "Arts and humanities",
            "social-sciences-journalism-information": "Social sciences, journalism and information",
            "business-administration-law": "Business, administration and law",
            "natural-sciences-mathematics-statistics": "Natural sciences, mathematics and statistics",
            "information-communication-technologies": "Information and Communication Technologies (ICTs)",
            "engineering-manufacturing-construction": "Engineering, manufacturing and construction",
            "agriculture-forestry-fisheries-veterinary": "Agriculture, forestry, fisheries and veterinary",
            "health-welfare": "Health and welfare",
            services: "Services",
        },
        educationFields: {
            "basic-programmes-qualifications": "Basic programmes and qualifications",
            "literacy-numeracy": "Literacy and numeracy",
            "personal-skills-development": "Personal skills and development",
            "education-science": "Education science",
            "training-for-pre-school-teachers": "Training for pre-school teachers",
            "teacher-training-without-subject-specialisation": "Teacher training without subject specialisation",
            "teacher-training-with-subject-specialisation": "Teacher training with subject specialisation",
            "audio-visual-techniques-media-production": "Audio-visual techniques and media production",
            "fashion-interior-industrial-design": "Fashion, interior and industrial design",
            "fine-arts": "Fine arts",
            handicrafts: "Handicrafts",
            "music-performing-arts": "Music and performing arts",
            "religion-theology": "Religion and theology",
            "history-archaeology": "History and archaeology",
            "philosophy-ethics": "Philosophy and ethics",
            "language-acquisition": "Language acquisition",
            "literature-linguistics": "Literature and linguistics",
            economics: "Economics",
            "political-sciences-civics": "Political sciences and civics",
            psychology: "Psychology",
            "sociology-cultural-studies": "Sociology and cultural studies",
            "journalism-reporting": "Journalism and reporting",
            "library-information-archival-studies": "Library, information and archival studies",
            "accounting-taxation": "Accounting and taxation",
            "finance-banking-insurance": "Finance, banking and insurance",
            "management-administration": "Management and administration",
            "marketing-advertising": "Marketing and advertising",
            "secretarial-office-work": "Secretarial and office work",
            "wholesale-retail-sales": "Wholesale and retail sales",
            "work-skills": "Work skills",
            law: "Law",
            biology: "Biology",
            biochemistry: "Biochemistry",
            "environmental-sciences": "Environmental sciences",
            "natural-environments-wildlife": "Natural environments and wildlife",
            chemistry: "Chemistry",
            "earth-sciences": "Earth sciences",
            physics: "Physics",
            mathematics: "Mathematics",
            statistics: "Statistics",
            "computer-use": "Computer use",
            "database-network-design-administration": "Database and network design and administration",
            "software-applications-development-analysis": "Software and applications development and analysis",
            "chemical-engineering-processes": "Chemical engineering and processes",
            "environmental-protection-technology": "Environmental protection technology",
            "electricity-energy": "Electricity and energy",
            "electronics-automation": "Electronics and automation",
            "mechanics-metal-trades": "Mechanics and metal trades",
            "motor-vehicles-ships-aircraft": "Motor vehicles, ships and aircraft",
            "food-processing": "Food processing",
            materials: "Materials (glass, paper, plastic and wood)",
            textiles: "Textiles (clothes, footwear and leather)",
            "mining-extraction": "Mining and extraction",
            "architecture-town-planning": "Architecture and town planning",
            "building-civil-engineering": "Building and civil engineering",
            "crop-livestock-production": "Crop and livestock production",
            horticulture: "Horticulture",
            forestry: "Forestry",
            fisheries: "Fisheries",
            veterinary: "Veterinary",
            "dental-studies": "Dental studies",
            medicine: "Medicine",
            "nursing-midwifery": "Nursing and midwifery",
            "medical-diagnostic-treatment-technology": "Medical diagnostic and treatment technology",
            "therapy-rehabilitation": "Therapy and rehabilitation",
            pharmacy: "Pharmacy",
            "traditional-complementary-medicine-therapy": "Traditional and complementary medicine and therapy",
            "domestic-services": "Domestic services",
            "hair-beauty-services": "Hair and beauty services",
            "hotel-restaurants-catering": "Hotel, restaurants and catering",
            sports: "Sports",
            "travel-tourism-leisure": "Travel, tourism and leisure",
            "community-sanitation": "Community sanitation",
            "occupational-health-safety": "Occupational health and safety",
            "military-defence": "Military and defence",
            "protection-of-persons-property": "Protection of persons and property",
            "transport-services": "Transport services",
        },
        levelOfStudy: "Level of study",
        degrees: {
            bsc1: "BSc1",
            bsc2: "BSc2",
            bsc3: "BSc3",
            m1: "M1",
            m2: "M2",
            phd: "PhD",
        },
        nationality: "Nationality",
        university: "University",
        search: "Search",
        selectCountry: "Select country",
        countryPickerLanguageCode: "common", // see TranslationLanguageCode from react-native-country-picker-modal
        profileType: "Type",
        profileTypes: "Types",
        allRoles: {
            student: "Student",
            staff: "Staff",
        },
        staffRoles: {
            teaching: "Teaching",
            research: "Research",
            administration: "Administration",
            technical: "Technical",
            other: "Other",
        },
        gender: "Gender",
        genders: {
            male: "Male",
            female: "Female",
            other: "Other",
        },
        dateOfBirth: "Date of birth",
        months: {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December",
        },
        fieldsOfEducation: "Fields of education",
        apply: "Apply",
        universities: {
            "univ-cadiz": "University of Cádiz",
            "univ-brest": "University of Bretagne Occidentale",
            "univ-gdansk": "University of Gdańsk",
            "univ-malta": "University of Malta",
            "univ-kiel": "University of Kiel",
            "univ-split": "University of Split",
        },
        universitiesPicker: {
            placeholder: "Select universities",
            searchPlaceholder: "Search",
            multiple: "%d selected",
        },
        logOut: "Log out",
        onboarding: {
            name: {
                title: "Welcome",
                subtitle:
                    "Before we start, we need to know a little bit more about you to ensure the best possible recommendations.",
            },
            personalInfo: {
                title: "Profile",
            },
            language: {
                title: "Languages",
            },
            interests: {
                title: "Interests",
            },
            role: {
                title: "I am a...",
            },
            roleSpecific1: {
                student: {
                    title: "Student information",
                },
                staff: {
                    title: "Staff roles",
                },
            },
            offersMeet: {
                title: "Meet",
                subtitle: "Meet up with new friends in real life.",
            },
            offersDiscover: {
                title: "Discover",
                subtitle: "Find out about other cultures.",
            },
            offersCollaborate: {
                title: "Collaborate",
                subtitle: "Find people to work on projects, academic or not.",
            },
            legal1: {
                title: "Terms & Conditions",
                text:
                    "As explained in details in our Terms & Conditions, you agree to use «SEA-EU Around» and its services only to be put into contact, on a non-business and non-profit basis, with people wishing to meet, collaborate and interact online or in the frame of a mobility. You commit to carry out respectful exchanges with other members. Your name and surname will be visible by other members.",
            },
            legal2: {
                title: "Data Policy",
                text:
                    "In the context of your use of SEA-EU Around, you will provide some personal data to create your profile as further explained in our Terms & Conditions. This data is collected and processed by UBO through SEA-EU Around in order to enable matching among Members, according to needs/offers and interests defined by Members of SEA-EU Around. Your data will be visible only by  other Members.",
            },
            legal3: {
                title: "Cookies",
                text:
                    "I acknowledge that cookies might be used. The information is kept only for application purposes and does not permit to identify the Member except for the cookie enabling UBO to re-authenticate the Member on its arrival on SEA-EU Around, saving the Member from having to re-enter their password at each connection.",
            },
            submit: "Submit",
            getStarted: "Get Started",
            profileCreated: "Welcome! Your profile is now created.",
            quit: {
                title: "Quit on-boarding",
                text: "Do you really wish to leave? You can resume later.",
                cancel: "Cancel",
                yes: "Yes",
            },
        },
        spokenLanguages: "Spoken languages",
        languagePicker: {
            placeholderSingle: "Language",
            placeholderMultiple: "Select languages",
            searchPlaceholder: "Search for languages",
            multiple: "%d selected",
        },
        languageLevelPicker: {
            placeholder: "Level",
        },
        languageLevels: {
            a1: "A1",
            a2: "A2",
            b1: "B1",
            b2: "B2",
            c1: "C1",
            c2: "C2",
            native: "Native",
        },
        languageNames: {
            aa: "Afar",
            ab: "Abkhazian",
            ae: "Avestan",
            af: "Afrikaans",
            ak: "Akan",
            am: "Amharic",
            an: "Aragonese",
            ar: "Arabic",
            as: "Assamese",
            av: "Avaric",
            ay: "Aymara",
            az: "Azerbaijani",
            ba: "Bashkir",
            be: "Belarusian",
            bg: "Bulgarian",
            bh: "Bihari languages",
            bi: "Bislama",
            bm: "Bambara",
            bn: "Bengali",
            bo: "Tibetan",
            br: "Breton",
            bs: "Bosnian",
            ca: "Catalan / Valencian",
            ce: "Chechen",
            ch: "Chamorro",
            co: "Corsican",
            cr: "Cree",
            cs: "Czech",
            cu: "Old Bulgarian / Church Slavic / Slavonic",
            cv: "Chuvash",
            cy: "Welsh",
            da: "Danish",
            de: "German",
            dv: "Divehi / Dhivehi / Maldivian",
            dz: "Dzongkha",
            ee: "Ewe",
            el: "Greek",
            en: "English",
            eo: "Esperanto",
            es: "Spanish",
            et: "Estonian",
            eu: "Basque",
            fa: "Persian",
            ff: "Fulah",
            fi: "Finnish",
            fj: "Fijian",
            fo: "Faroese",
            fr: "French",
            fy: "Western Frisian",
            ga: "Irish",
            gd: "Scottish Gaelic",
            gl: "Galician",
            gn: "Guarani",
            gu: "Gujarati",
            gv: "Manx",
            ha: "Hausa",
            he: "Hebrew",
            hi: "Hindi",
            ho: "Hiri Motu",
            hr: "Croatian",
            ht: "Haitian Creole",
            hu: "Hungarian",
            hy: "Armenian",
            hz: "Herero",
            ia: "Interlingua",
            id: "Indonesian",
            ie: "Interlingue / Occidental",
            ig: "Igbo",
            ii: "Sichuan Yi / Nuosu",
            ik: "Inupiaq",
            io: "Ido",
            is: "Icelandic",
            it: "Italian",
            iu: "Inuktitut",
            ja: "Japanese",
            jv: "Javanese",
            ka: "Georgian",
            kg: "Kongo",
            ki: "Kikuyu / Gikuyu",
            kj: "Kuanyama / Kwanyama",
            kk: "Kazakh",
            kl: "Kalaallisut / Greenlandic",
            km: "Central Khmer",
            kn: "Kannada",
            ko: "Korean",
            kr: "Kanuri",
            ks: "Kashmiri",
            ku: "Kurdish",
            kv: "Komi",
            kw: "Cornish",
            ky: "Kirghiz / Kyrgyz",
            la: "Latin",
            lb: "Luxembourgish / Letzeburgesch",
            lg: "Ganda",
            li: "Limburgan / Limburger / Limburgish",
            ln: "Lingala",
            lo: "Lao",
            lt: "Lithuanian",
            lu: "Luba-Katanga",
            lv: "Latvian",
            mg: "Malagasy",
            mh: "Marshallese",
            mi: "Maori",
            mk: "Macedonian",
            ml: "Malayalam",
            mn: "Mongolian",
            mr: "Marathi",
            ms: "Malay",
            mt: "Maltese",
            my: "Burmese",
            na: "Nauru",
            nb: "Norwegian Bokmål",
            nd: "North Ndebele",
            ne: "Nepali",
            ng: "Ndonga",
            nl: "Dutch / Flemish",
            nn: "Norwegian Nynorsk",
            no: "Norwegian",
            nr: "South Ndebele",
            nv: "Navajo / Navaho",
            ny: "Chichewa / Chewa / Nyanja",
            oc: "Occitan",
            oj: "Ojibwa",
            om: "Oromo",
            or: "Oriya",
            os: "Ossetian / Ossetic",
            pa: "Punjabi / Panjabi",
            pi: "Pali",
            pl: "Polish",
            ps: "Pashto / Pushto",
            pt: "Portuguese",
            qu: "Quechua",
            rc: "Reunionese",
            rm: "Romansh",
            rn: "Rundi",
            ro: "Romanian / Moldavian",
            ru: "Russian",
            rw: "Kinyarwanda",
            sa: "Sanskrit",
            sc: "Sardinian",
            sd: "Sindhi",
            se: "Northern Sami",
            sg: "Sango",
            sh: "Serbo-Croatian",
            si: "Sinhala / Sinhalese",
            sk: "Slovak",
            sl: "Slovenian",
            sm: "Samoan",
            sn: "Shona",
            so: "Somali",
            sq: "Albanian",
            sr: "Serbian",
            ss: "Swati",
            st: "Southern Sotho",
            su: "Sundanese",
            sv: "Swedish",
            sw: "Swahili",
            ta: "Tamil",
            te: "Telugu",
            tg: "Tajik",
            th: "Thai",
            ti: "Tigrinya",
            tk: "Turkmen",
            tl: "Tagalog",
            tn: "Tswana",
            to: "Tonga (Tonga Islands)",
            tr: "Turkish",
            ts: "Tsonga",
            tt: "Tatar",
            tw: "Twi",
            ty: "Tahitian",
            ug: "Uighur / Uyghur",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            ve: "Venda",
            vi: "Vietnamese",
            vo: "Volapük",
            wa: "Walloon",
            wo: "Wolof",
            xh: "Xhosa",
            yi: "Yiddish",
            yo: "Yoruba",
            za: "Zhuang / Chuang",
            zh: "Chinese",
            zu: "Zulu",
        },
        interests: "Interests",
        chooseInterests: "Choose interests",
        interestsPicker: {
            placeholder: "Select interests",
            searchPlaceholder: "Search",
            multiple: "%d selected",
        },
        interestNames: {
            "language-exchange": "Language exchange",
            "second-hand-apparel": "Second hand apparel",
            "board-games": "Board games",
            "road-trips": "Road trips",
            tango: "Tango",
            sneakers: "Sneakers",
            sports: "Sports",
            baking: "Baking",
            tarot: "Tarot",
            art: "Art",
            tea: "Tea",
            picnicking: "Picnicking",
            motorcycles: "Motorcycles",
            parties: "Parties",
            shopping: "Shopping",
            couchsurfing: "Couch-surfing",
            netflix: "Netflix",
            cooking: "Cooking",
            vegan: "Vegan",
            brunch: "Brunch",
            "motor-sports": "Motor sports",
            "grab-a-drink": "Grab a drink",
            "working-out": "Working out",
            "start-ups": "Start ups",
            "street-food": "Street food",
            "craft-beer": "Craft beer",
            "amateur-cook": "Amateur cook",
            "happy-hour": "Happy hour",
            "vintage-fashion": "Vintage fashion",
            "walking-my-dog": "Walking my dog",
            "second-hand-shopping": "Second hand shopping",
            politics: "Politics",
            bbq: "BBQ",
            surfing: "Surfing",
            spirituality: "Spirituality",
            gardening: "Gardening",
            astrology: "Astrology",
            climbing: "Climbing",
            tennis: "Tennis",
            writer: "Writer",
            comedy: "Comedy",
            wine: "Wine",
            diy: "Diy",
            coffee: "Coffee",
            sailing: "Sailing",
            music: "Music",
            cycling: "Cycling",
            activism: "Activism",
            trivia: "Trivia",
            travel: "Travel",
            instagram: "Instagram",
            museum: "Museum",
            karaoke: "Karaoke",
            fashion: "Fashion",
            blogging: "Blogging",
            yoga: "Yoga",
            investing: "Investing",
            petanque: "Petanque",
            theater: "Theater",
            environmentalism: "Environmentalism",
            crossfit: "Crossfit",
            dancing: "Dancing",
            hiking: "Hiking",
            running: "Running",
            golf: "Golf",
            photography: "Photography",
            vlogging: "Vlogging",
            volunteering: "Volunteering",
            tattoos: "Tattoos",
            outdoors: "Outdoors",
            esports: "Esports",
            snowboarding: "Snowboarding",
            athlete: "Athlete",
            extrovert: "Extrovert",
            podcasts: "Podcasts",
            walking: "Walking",
            vegetarian: "Vegetarian",
            reading: "Reading",
            movies: "Movies",
            foodie: "Foodie",
            soccer: "Soccer",
            skiing: "Skiing",
            sushi: "Sushi",
            introvert: "Introvert",
            skateboarder: "Skateboarder",
            festivals: "Festivals",
            fishing: "Fishing",
            swimming: "Swimming",
            expositions: "Expositions",
            gamer: "Gamer",
            piano: "Piano",
            "foodie-tour": "Foodie Tour",
            "dog-lover": "Dog Lover",
            "cat-lover": "Cat Lover",
        },
        offerCategories: {
            meet: "Meet",
            discover: "Discover",
            collaborate: "Collaborate",
        },
        offers: "Offers",
        allOffers: {
            "grab-a-drink": {
                name: "Grab a drink",
                help: "I am open to having a drink with the people I meet on this platform.",
            },
            "provide-a-couch": {
                name: "Provide a couch",
                help: "I am open to letting someone sleep on my couch.",
            },
            "get-into-campus-life": {
                name: "Get into campus life",
                help: "I am open to helping someone visit my campus.",
            },
            "cowork-on-a-project": {
                name: "Co-work on a project",
                help: "I am looking for collaborators for a project.",
            },
            "answer-academic-questions": {
                name: "Answer academic questions",
                help: "I can give information about my university or answer to general academic questions.",
            },
            "share-interests": {
                name: "Share interests",
                help: "I would like to chat with other users about common interests.",
            },
            "language-tandem": {
                name: "Language tandem",
                help: "I am willing to join a language tandem to help others learn one of my languages.",
            },
        },
        // Unmatch modal
        unmatch: {
            text: "Are you sure you want to unmatch {{firstname}}? You will not be able to communicate anymore.",
            blockQuestion: "If you don't want {{firstname}} to be able to find you anymore, you can also block them:",
            action: "Unmatch",
        },
        // Block modal
        block: {
            warning:
                "Are you sure you want to block this user? You and {{firstname}} will not be able to find each other anymore.",
            action: "Block",
        },
        // Welcome screen
        welcomeScreen: {
            signIn: "Log in",
            signUp: "Sign up",
            subtitle: "Join an alliance united around the values of European identity.",
        },
        // Login
        loginForm: {
            title: "Welcome Back!",
            logIn: "Log in",
            signUp: "Sign up",
            or: "or",
        },
        // Cookies
        cookies: {
            bannerText:
                "We use cookies to provide you with the best possible user experience.\nOur usage of cookies includes caching data for faster loading, storing your preferences and authentication. We do not collect any information that could be used for tracking or advertising.",
            acceptAll: "Accept cookies",
            customize: "Customize",
            preferences: {
                auth: {
                    name: "Authentication",
                    description: "Store information used to sign-in automatically when starting the app.",
                },
                cache: {
                    name: "Cache",
                    description: "Store some data on your device (less than 1MB) for faster loading.",
                },
                settings: {name: "Settings", description: "Store your settings (e.g. theme and locale)."},
            },
        },
        // Report
        report: {
            title: "Report",
            send: "Send",
            cancel: "Cancel",
            what: "What / who?",
            why: "Why?",
            typePlaceholder: "Select a type",
            types: {
                violence: "Violence",
                nudity: "Nudity",
                harassment: "Harassment",
                "undesirable-content": "Undesirable content",
                "hate-speech": "Hate speech",
                "vulgar-content": "Vulgar content",
                other: "Other",
            },
            confirmationTitle: "Thank you",
            confirmation: "An administrator will investigate your report shortly.",
            failureTitle: "Sorry",
            failure: "We are unable to fulfill your request.",
        },
        // Reset password
        resetPassword: {
            instructions: "To choose a new password, click the link in the email we just sent you.",
            title: "Please choose a new password",
            button: "Send",
            success: "Your password has been updated.",
        },
        // Delete account
        deleteAccount: {
            title: "Delete your account",
            warning:
                "Your account and all associated data will be deleted within six months. Please be aware that after this time, your account will be irreversibly deleted. If you sign in during this month however, the deletion will be cancelled.",
            button: "Delete",
            success1: "Your request has been received and will be processed shortly.",
            success2: "We are sorry to see you go.",
            leave: "Leave",
            inputLabel: "Enter password to confirm",
        },
        // Messaging tab
        messaging: {
            noMatches: "It appears that you haven't matched with anyone yet. :(",
        },
        // Matching tab
        matching: {
            noResults: "No results found",
            noResultsAdvice: "Perhaps try removing some filters",
            filtering: {
                sectionGeneral: "General",
                buttonReset: "Reset",
            },
            actionLike: "Like",
            actionHide: "Hide",
            success: {
                title: "It's a match !",
                chat: "Start chatting",
                continue: "Keep scrolling",
            },
            history: {
                status: {
                    requested: "Liked",
                    declined: "Hidden",
                    blocked: "Blocked",
                },
                actions: {
                    report: "Report",
                    cancel: "Cancel",
                    block: "Block",
                },
                noResults: "No results found",
                noResultsAdvice: "Perhaps try removing some filters",
            },
        },
        // Profile tab
        profile: {
            action: {
                chat: "Chat",
                mute: "Mute",
                block: "Block",
                unmatch: "Unmatch",
                report: "Report",
            },
            noOffersSelected: "No offers selected.",
        },
        screenTitles: {
            suffix: " - SEA-EU Around",
            WelcomeScreen: "Welcome",
            LoginScreen: "Login",
            ForgotPasswordScreen: "Forgot Password",
            SignupScreen: "Sign up",
            OnboardingNameScreen: "Welcome",
            OnboardingPersonalInfoScreen: "Profile",
            OnboardingLanguageScreen: "Profile",
            OnboardingInterestsScreen: "Profile",
            OnboardingRoleScreen: "Profile",
            OnboardingRoleSpecificScreen: "Profile",
            OnboardingOffersScreen1: "Discover",
            OnboardingOffersScreen2: "Collaborate",
            OnboardingOffersScreen3: "Meet",
            OnboardingLegalScreen1: "Terms & Conditions",
            OnboardingPrivacyScreen: "Privacy Policy",
            ChatRoomsScreen: "Messages",
            ChatScreen: "Chat",
            TabHomeScreen: "Home",
            TabMatchingScreen: "Match",
            MatchFilteringScreen: "Filters",
            MatchHistoryScreen: "History",
            TabNotificationsScreen: "Notifications",
            MyProfileScreen: "Profile",
            ProfileScreen: "Profile",
            SettingsScreen: "Settings",
            DeleteAccountScreen: "Delete Account",
            DeleteAccountSuccessScreen: "Account Deleted",
            ValidationEmailSentScreen: "Validate your account",
            ValidateEmailScreen: "Validate your account",
            ResetPasswordScreen: "Reset your password",
            ResetPasswordSuccessScreen: "Password reset",
            OnboardingSuccessfulScreen: "Successful registration",
            NotFoundScreen: "Not Found",
            MatchSuccessScreen: "Match!",
            ForgotPasswordEmailSentScreen: "Forgot password",
        },
        // Settings screen
        settings: {
            sections: {
                general: "General",
                danger: "Danger zone",
                about: "About",
            },
            language: "Language",
            darkTheme: "Dark theme",
            deleteAccount: "Delete Account",
            deleteMyAccount: "Delete my account",
            version: "Version",
            termsOfService: "Terms of Service",
            reportABug: "Report a Bug",
            logOut: "Log out",
            customizeCookies: "Customize cookies",
        },
    },
    fr: {
        locales: {
            en: "Anglais",
            fr: "Français",
        },
        appName: "SEA-EU Around",
        welcome: "Bienvenue",
        login: "Connexion",
        signup: "Inscription",
        emailAddress: "Adresse email",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié",
        countryPickerLanguageCode: "fra", // see TranslationLanguageCode from react-native-country-picker-modal
    },
};
