cmake_minimum_required(VERSION "3.16")
project(leetcode-progress
	DESCRIPTION "Keeps record of your progress on leetcode"
	LANGUAGES CXX
	)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# include CPM.cmake
include(cmake/CPM.cmake)

# Add nanogui
CPMAddPackage(
    NAME nanogui
    GITHUB_REPOSITORY mitsuba-renderer/nanogui
    GIT_TAG "c6505300bb3036ec87ac68f5f1699c434c3d7fc6"
    OPTIONS
    "NANOGUI_BUILD_EXAMPLE OFF" "NANOGUI_BUILD_PYTHON  OFF" "NANOGUI_INSTALL       OFF"
	)

add_definitions(${NANOGUI_EXTRA_DEPS})
#target_include_directories(${NANOGUI_EXTRA_INCS})
add_executable(leetcode-progress src/main.cpp)
target_link_libraries(leetcode-progress nanogui ${NANOGUI_EXTRA_LIBS})
