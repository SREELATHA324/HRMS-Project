--
-- PostgreSQL database dump
--

\restrict 5fyHPtimrFu9Uq8JbkbdnSjqb3bi4glXzbLdkr53Uz4opjbHyY7hEVtG15e02hB

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-11 15:19:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 355 (class 1259 OID 18201)
-- Name: announcement_recipients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcement_recipients (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    user_id integer NOT NULL,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.announcement_recipients OWNER TO postgres;

--
-- TOC entry 354 (class 1259 OID 18200)
-- Name: announcement_recipients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcement_recipients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcement_recipients_id_seq OWNER TO postgres;

--
-- TOC entry 6635 (class 0 OID 0)
-- Dependencies: 354
-- Name: announcement_recipients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcement_recipients_id_seq OWNED BY public.announcement_recipients.id;


--
-- TOC entry 291 (class 1259 OID 17385)
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    company_id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    announcement_type character varying(50) DEFAULT 'Company'::character varying,
    department_id integer,
    published_by integer NOT NULL,
    publish_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expiry_date timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT announcements_check CHECK (((expiry_date IS NULL) OR (expiry_date >= publish_date)))
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 17384)
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO postgres;

--
-- TOC entry 6636 (class 0 OID 0)
-- Dependencies: 290
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- TOC entry 351 (class 1259 OID 18143)
-- Name: approval_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_actions (
    id integer NOT NULL,
    approval_request_id integer NOT NULL,
    step_number integer NOT NULL,
    approver_id integer NOT NULL,
    action character varying(30) NOT NULL,
    comments text,
    action_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT approval_actions_action_check CHECK (((action)::text = ANY ((ARRAY['Approved'::character varying, 'Rejected'::character varying, 'Returned'::character varying])::text[])))
);


ALTER TABLE public.approval_actions OWNER TO postgres;

--
-- TOC entry 350 (class 1259 OID 18142)
-- Name: approval_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_actions_id_seq OWNER TO postgres;

--
-- TOC entry 6637 (class 0 OID 0)
-- Dependencies: 350
-- Name: approval_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_actions_id_seq OWNED BY public.approval_actions.id;


--
-- TOC entry 349 (class 1259 OID 18117)
-- Name: approval_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_requests (
    id integer NOT NULL,
    workflow_id integer NOT NULL,
    requester_id integer NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer NOT NULL,
    current_step integer DEFAULT 1,
    status character varying(30) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.approval_requests OWNER TO postgres;

--
-- TOC entry 348 (class 1259 OID 18116)
-- Name: approval_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_requests_id_seq OWNER TO postgres;

--
-- TOC entry 6638 (class 0 OID 0)
-- Dependencies: 348
-- Name: approval_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_requests_id_seq OWNED BY public.approval_requests.id;


--
-- TOC entry 347 (class 1259 OID 18092)
-- Name: approval_workflow_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_workflow_steps (
    id integer NOT NULL,
    workflow_id integer NOT NULL,
    step_number integer NOT NULL,
    approver_role_id integer NOT NULL,
    is_required boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.approval_workflow_steps OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 18091)
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_workflow_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_workflow_steps_id_seq OWNER TO postgres;

--
-- TOC entry 6639 (class 0 OID 0)
-- Dependencies: 346
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_workflow_steps_id_seq OWNED BY public.approval_workflow_steps.id;


--
-- TOC entry 345 (class 1259 OID 18063)
-- Name: approval_workflows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_workflows (
    id integer NOT NULL,
    company_id integer NOT NULL,
    workflow_name character varying(150) NOT NULL,
    workflow_type character varying(50) NOT NULL,
    first_approver_role_id integer,
    second_approver_role_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.approval_workflows OWNER TO postgres;

--
-- TOC entry 344 (class 1259 OID 18062)
-- Name: approval_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_workflows_id_seq OWNER TO postgres;

--
-- TOC entry 6640 (class 0 OID 0)
-- Dependencies: 344
-- Name: approval_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_workflows_id_seq OWNED BY public.approval_workflows.id;


--
-- TOC entry 327 (class 1259 OID 17832)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    company_id integer NOT NULL,
    asset_code character varying(100) NOT NULL,
    asset_name character varying(200) NOT NULL,
    asset_type character varying(100),
    serial_number character varying(150),
    purchase_date date,
    purchase_cost numeric(12,2),
    status character varying(30) DEFAULT 'Available'::character varying,
    assigned_to integer,
    assigned_date date,
    returned_date date,
    condition_on_assignment character varying(100),
    condition_on_return character varying(100),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assets_purchase_cost_check CHECK (((purchase_cost IS NULL) OR (purchase_cost >= (0)::numeric)))
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 326 (class 1259 OID 17831)
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO postgres;

--
-- TOC entry 6641 (class 0 OID 0)
-- Dependencies: 326
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- TOC entry 243 (class 1259 OID 16647)
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    shift_id integer,
    attendance_date date NOT NULL,
    check_in timestamp without time zone,
    check_out timestamp without time zone,
    working_hours numeric(5,2) DEFAULT 0,
    overtime_hours numeric(5,2) DEFAULT 0,
    status character varying(30) DEFAULT 'Present'::character varying NOT NULL,
    late_minutes integer DEFAULT 0,
    early_checkout_minutes integer DEFAULT 0,
    correction_requested boolean DEFAULT false,
    correction_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- TOC entry 385 (class 1259 OID 18547)
-- Name: attendance_calendar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_calendar (
    id integer NOT NULL,
    company_id integer NOT NULL,
    attendance_date date NOT NULL,
    is_working_day boolean DEFAULT true,
    holiday_id integer,
    weekly_off boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_calendar OWNER TO postgres;

--
-- TOC entry 384 (class 1259 OID 18546)
-- Name: attendance_calendar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_calendar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_calendar_id_seq OWNER TO postgres;

--
-- TOC entry 6642 (class 0 OID 0)
-- Dependencies: 384
-- Name: attendance_calendar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_calendar_id_seq OWNED BY public.attendance_calendar.id;


--
-- TOC entry 329 (class 1259 OID 17861)
-- Name: attendance_corrections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_corrections (
    id integer NOT NULL,
    attendance_id integer NOT NULL,
    employee_id integer NOT NULL,
    requested_check_in timestamp without time zone,
    requested_check_out timestamp without time zone,
    reason text NOT NULL,
    status character varying(30) DEFAULT 'Pending'::character varying,
    approved_by integer,
    approved_at timestamp without time zone,
    rejection_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_corrections OWNER TO postgres;

--
-- TOC entry 328 (class 1259 OID 17860)
-- Name: attendance_corrections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_corrections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_corrections_id_seq OWNER TO postgres;

--
-- TOC entry 6643 (class 0 OID 0)
-- Dependencies: 328
-- Name: attendance_corrections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_corrections_id_seq OWNED BY public.attendance_corrections.id;


--
-- TOC entry 242 (class 1259 OID 16646)
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- TOC entry 6644 (class 0 OID 0)
-- Dependencies: 242
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- TOC entry 303 (class 1259 OID 17513)
-- Name: attendance_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_rules (
    id integer NOT NULL,
    company_id integer NOT NULL,
    rule_name character varying(150) NOT NULL,
    late_grace_minutes integer DEFAULT 0,
    early_checkout_grace_minutes integer DEFAULT 0,
    half_day_hours numeric(5,2) DEFAULT 4,
    full_day_hours numeric(5,2) DEFAULT 8,
    overtime_enabled boolean DEFAULT true,
    overtime_threshold_hours numeric(5,2) DEFAULT 8,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_rules OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 17512)
-- Name: attendance_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_rules_id_seq OWNER TO postgres;

--
-- TOC entry 6645 (class 0 OID 0)
-- Dependencies: 302
-- Name: attendance_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_rules_id_seq OWNED BY public.attendance_rules.id;


--
-- TOC entry 383 (class 1259 OID 18518)
-- Name: attendance_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_status_history (
    id integer NOT NULL,
    attendance_id integer NOT NULL,
    employee_id integer NOT NULL,
    old_status character varying(30),
    new_status character varying(30) NOT NULL,
    changed_by integer,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_status_history OWNER TO postgres;

--
-- TOC entry 382 (class 1259 OID 18517)
-- Name: attendance_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 6646 (class 0 OID 0)
-- Dependencies: 382
-- Name: attendance_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_status_history_id_seq OWNED BY public.attendance_status_history.id;


--
-- TOC entry 301 (class 1259 OID 17496)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    entity_type character varying(100),
    entity_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 17495)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- TOC entry 6647 (class 0 OID 0)
-- Dependencies: 300
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 233 (class 1259 OID 16506)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16505)
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- TOC entry 6648 (class 0 OID 0)
-- Dependencies: 232
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- TOC entry 227 (class 1259 OID 16459)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(150),
    phone character varying(20),
    address text,
    website character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16458)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- TOC entry 6649 (class 0 OID 0)
-- Dependencies: 226
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- TOC entry 357 (class 1259 OID 18225)
-- Name: company_event_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_event_participants (
    id integer NOT NULL,
    event_id integer NOT NULL,
    employee_id integer NOT NULL,
    attendance_status character varying(30) DEFAULT 'Registered'::character varying,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company_event_participants OWNER TO postgres;

--
-- TOC entry 356 (class 1259 OID 18224)
-- Name: company_event_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_event_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_event_participants_id_seq OWNER TO postgres;

--
-- TOC entry 6650 (class 0 OID 0)
-- Dependencies: 356
-- Name: company_event_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_event_participants_id_seq OWNED BY public.company_event_participants.id;


--
-- TOC entry 323 (class 1259 OID 17779)
-- Name: company_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_events (
    id integer NOT NULL,
    company_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    event_date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    location character varying(255),
    created_by integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT company_events_check CHECK (((end_time IS NULL) OR (start_time IS NULL) OR (end_time >= start_time)))
);


ALTER TABLE public.company_events OWNER TO postgres;

--
-- TOC entry 322 (class 1259 OID 17778)
-- Name: company_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_events_id_seq OWNER TO postgres;

--
-- TOC entry 6651 (class 0 OID 0)
-- Dependencies: 322
-- Name: company_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_events_id_seq OWNED BY public.company_events.id;


--
-- TOC entry 307 (class 1259 OID 17556)
-- Name: company_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_settings (
    id integer NOT NULL,
    company_id integer NOT NULL,
    setting_name character varying(100) NOT NULL,
    setting_value text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company_settings OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 17555)
-- Name: company_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_settings_id_seq OWNER TO postgres;

--
-- TOC entry 6652 (class 0 OID 0)
-- Dependencies: 306
-- Name: company_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_settings_id_seq OWNED BY public.company_settings.id;


--
-- TOC entry 339 (class 1259 OID 18001)
-- Name: department_holidays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department_holidays (
    id integer NOT NULL,
    department_id integer NOT NULL,
    holiday_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.department_holidays OWNER TO postgres;

--
-- TOC entry 338 (class 1259 OID 18000)
-- Name: department_holidays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_holidays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_holidays_id_seq OWNER TO postgres;

--
-- TOC entry 6653 (class 0 OID 0)
-- Dependencies: 338
-- Name: department_holidays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_holidays_id_seq OWNED BY public.department_holidays.id;


--
-- TOC entry 229 (class 1259 OID 16472)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16471)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- TOC entry 6654 (class 0 OID 0)
-- Dependencies: 228
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 231 (class 1259 OID 16492)
-- Name: designations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.designations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.designations OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16491)
-- Name: designations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.designations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.designations_id_seq OWNER TO postgres;

--
-- TOC entry 6655 (class 0 OID 0)
-- Dependencies: 230
-- Name: designations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.designations_id_seq OWNED BY public.designations.id;


--
-- TOC entry 367 (class 1259 OID 18356)
-- Name: document_activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_activity_logs (
    id integer NOT NULL,
    document_id integer NOT NULL,
    user_id integer NOT NULL,
    action character varying(50) NOT NULL,
    action_details text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.document_activity_logs OWNER TO postgres;

--
-- TOC entry 366 (class 1259 OID 18355)
-- Name: document_activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_activity_logs_id_seq OWNER TO postgres;

--
-- TOC entry 6656 (class 0 OID 0)
-- Dependencies: 366
-- Name: document_activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_activity_logs_id_seq OWNED BY public.document_activity_logs.id;


--
-- TOC entry 269 (class 1259 OID 17019)
-- Name: document_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_categories (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.document_categories OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 17018)
-- Name: document_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_categories_id_seq OWNER TO postgres;

--
-- TOC entry 6657 (class 0 OID 0)
-- Dependencies: 268
-- Name: document_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_categories_id_seq OWNED BY public.document_categories.id;


--
-- TOC entry 313 (class 1259 OID 17613)
-- Name: document_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_settings (
    id integer NOT NULL,
    company_id integer NOT NULL,
    document_category_id integer,
    max_file_size_mb integer DEFAULT 10,
    allowed_file_types character varying(255),
    verification_required boolean DEFAULT true,
    expiry_tracking_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.document_settings OWNER TO postgres;

--
-- TOC entry 312 (class 1259 OID 17612)
-- Name: document_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_settings_id_seq OWNER TO postgres;

--
-- TOC entry 6658 (class 0 OID 0)
-- Dependencies: 312
-- Name: document_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_settings_id_seq OWNED BY public.document_settings.id;


--
-- TOC entry 271 (class 1259 OID 17041)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    category_id integer NOT NULL,
    document_name character varying(200) NOT NULL,
    file_url character varying(500) NOT NULL,
    document_number character varying(100),
    issue_date date,
    expiry_date date,
    verification_status character varying(30) DEFAULT 'Pending'::character varying,
    verified_by integer,
    verified_at timestamp without time zone,
    rejection_reason text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 17040)
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- TOC entry 6659 (class 0 OID 0)
-- Dependencies: 270
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- TOC entry 297 (class 1259 OID 17459)
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    verified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.email_verification_tokens OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 17458)
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_verification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verification_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 6660 (class 0 OID 0)
-- Dependencies: 296
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_verification_tokens_id_seq OWNED BY public.email_verification_tokens.id;


--
-- TOC entry 361 (class 1259 OID 18277)
-- Name: employee_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_assets (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    asset_id integer NOT NULL,
    assigned_date date NOT NULL,
    returned_date date,
    assignment_status character varying(30) DEFAULT 'Assigned'::character varying,
    condition_on_assignment character varying(100),
    condition_on_return character varying(100),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_assets_check CHECK (((returned_date IS NULL) OR (returned_date >= assigned_date)))
);


ALTER TABLE public.employee_assets OWNER TO postgres;

--
-- TOC entry 360 (class 1259 OID 18276)
-- Name: employee_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_assets_id_seq OWNER TO postgres;

--
-- TOC entry 6661 (class 0 OID 0)
-- Dependencies: 360
-- Name: employee_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_assets_id_seq OWNED BY public.employee_assets.id;


--
-- TOC entry 417 (class 1259 OID 18976)
-- Name: employee_bank_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_bank_accounts (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    account_holder_name character varying(150) NOT NULL,
    bank_name character varying(150) NOT NULL,
    account_number character varying(50) NOT NULL,
    ifsc_code character varying(20) NOT NULL,
    account_type character varying(30) DEFAULT 'Savings'::character varying,
    is_primary boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_bank_accounts OWNER TO postgres;

--
-- TOC entry 416 (class 1259 OID 18975)
-- Name: employee_bank_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_bank_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_bank_accounts_id_seq OWNER TO postgres;

--
-- TOC entry 6662 (class 0 OID 0)
-- Dependencies: 416
-- Name: employee_bank_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_bank_accounts_id_seq OWNED BY public.employee_bank_accounts.id;


--
-- TOC entry 341 (class 1259 OID 18024)
-- Name: employee_birthdays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_birthdays (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    birth_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_birthdays OWNER TO postgres;

--
-- TOC entry 340 (class 1259 OID 18023)
-- Name: employee_birthdays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_birthdays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_birthdays_id_seq OWNER TO postgres;

--
-- TOC entry 6663 (class 0 OID 0)
-- Dependencies: 340
-- Name: employee_birthdays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_birthdays_id_seq OWNED BY public.employee_birthdays.id;


--
-- TOC entry 409 (class 1259 OID 18852)
-- Name: employee_documents_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_documents_access (
    id integer NOT NULL,
    document_id integer NOT NULL,
    user_id integer NOT NULL,
    can_view boolean DEFAULT true,
    can_download boolean DEFAULT false,
    granted_by integer,
    granted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_documents_access OWNER TO postgres;

--
-- TOC entry 408 (class 1259 OID 18851)
-- Name: employee_documents_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_documents_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_documents_access_id_seq OWNER TO postgres;

--
-- TOC entry 6664 (class 0 OID 0)
-- Dependencies: 408
-- Name: employee_documents_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_documents_access_id_seq OWNED BY public.employee_documents_access.id;


--
-- TOC entry 335 (class 1259 OID 17956)
-- Name: employee_emergency_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_emergency_contacts (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    contact_name character varying(150) NOT NULL,
    relationship character varying(100),
    phone character varying(20) NOT NULL,
    alternate_phone character varying(20),
    email character varying(150),
    address text,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_emergency_contacts OWNER TO postgres;

--
-- TOC entry 334 (class 1259 OID 17955)
-- Name: employee_emergency_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_emergency_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_emergency_contacts_id_seq OWNER TO postgres;

--
-- TOC entry 6665 (class 0 OID 0)
-- Dependencies: 334
-- Name: employee_emergency_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_emergency_contacts_id_seq OWNED BY public.employee_emergency_contacts.id;


--
-- TOC entry 401 (class 1259 OID 18749)
-- Name: employee_employment_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_employment_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    employment_type_id integer,
    designation_id integer,
    department_id integer,
    branch_id integer,
    start_date date NOT NULL,
    end_date date,
    status character varying(30),
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_employment_history_check CHECK (((end_date IS NULL) OR (end_date >= start_date)))
);


ALTER TABLE public.employee_employment_history OWNER TO postgres;

--
-- TOC entry 400 (class 1259 OID 18748)
-- Name: employee_employment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_employment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_employment_history_id_seq OWNER TO postgres;

--
-- TOC entry 6666 (class 0 OID 0)
-- Dependencies: 400
-- Name: employee_employment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_employment_history_id_seq OWNED BY public.employee_employment_history.id;


--
-- TOC entry 413 (class 1259 OID 18905)
-- Name: employee_exit_interviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_exit_interviews (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    resignation_id integer NOT NULL,
    interview_date date,
    conducted_by integer,
    reason_for_leaving text,
    feedback text,
    suggestions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_exit_interviews OWNER TO postgres;

--
-- TOC entry 412 (class 1259 OID 18904)
-- Name: employee_exit_interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_exit_interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_exit_interviews_id_seq OWNER TO postgres;

--
-- TOC entry 6667 (class 0 OID 0)
-- Dependencies: 412
-- Name: employee_exit_interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_exit_interviews_id_seq OWNED BY public.employee_exit_interviews.id;


--
-- TOC entry 239 (class 1259 OID 16600)
-- Name: employee_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    change_type character varying(50) NOT NULL,
    old_value text,
    new_value text,
    effective_date date NOT NULL,
    remarks text,
    changed_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_history OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16599)
-- Name: employee_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_history_id_seq OWNER TO postgres;

--
-- TOC entry 6668 (class 0 OID 0)
-- Dependencies: 238
-- Name: employee_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_history_id_seq OWNED BY public.employee_history.id;


--
-- TOC entry 405 (class 1259 OID 18815)
-- Name: employee_invitation_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_invitation_tasks (
    id integer NOT NULL,
    invitation_id integer NOT NULL,
    task_name character varying(200) NOT NULL,
    task_description text,
    status character varying(30) DEFAULT 'Pending'::character varying,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_invitation_tasks OWNER TO postgres;

--
-- TOC entry 404 (class 1259 OID 18814)
-- Name: employee_invitation_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_invitation_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_invitation_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 6669 (class 0 OID 0)
-- Dependencies: 404
-- Name: employee_invitation_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_invitation_tasks_id_seq OWNED BY public.employee_invitation_tasks.id;


--
-- TOC entry 403 (class 1259 OID 18788)
-- Name: employee_invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_invitations (
    id integer NOT NULL,
    company_id integer NOT NULL,
    email character varying(150) NOT NULL,
    employee_code character varying(50),
    invited_by integer NOT NULL,
    invitation_token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    status character varying(30) DEFAULT 'Pending'::character varying,
    accepted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_invitations OWNER TO postgres;

--
-- TOC entry 402 (class 1259 OID 18787)
-- Name: employee_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_invitations_id_seq OWNER TO postgres;

--
-- TOC entry 6670 (class 0 OID 0)
-- Dependencies: 402
-- Name: employee_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_invitations_id_seq OWNED BY public.employee_invitations.id;


--
-- TOC entry 379 (class 1259 OID 18475)
-- Name: employee_login_security; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_login_security (
    id integer NOT NULL,
    user_id integer NOT NULL,
    failed_login_attempts integer DEFAULT 0,
    account_locked boolean DEFAULT false,
    locked_until timestamp without time zone,
    last_successful_login timestamp without time zone,
    last_failed_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_login_security OWNER TO postgres;

--
-- TOC entry 378 (class 1259 OID 18474)
-- Name: employee_login_security_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_login_security_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_login_security_id_seq OWNER TO postgres;

--
-- TOC entry 6671 (class 0 OID 0)
-- Dependencies: 378
-- Name: employee_login_security_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_login_security_id_seq OWNED BY public.employee_login_security.id;


--
-- TOC entry 393 (class 1259 OID 18653)
-- Name: employee_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_notes (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    created_by integer NOT NULL,
    note text NOT NULL,
    is_private boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_notes OWNER TO postgres;

--
-- TOC entry 392 (class 1259 OID 18652)
-- Name: employee_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_notes_id_seq OWNER TO postgres;

--
-- TOC entry 6672 (class 0 OID 0)
-- Dependencies: 392
-- Name: employee_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_notes_id_seq OWNED BY public.employee_notes.id;


--
-- TOC entry 369 (class 1259 OID 18380)
-- Name: employee_policy_acknowledgments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_policy_acknowledgments (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    policy_id integer NOT NULL,
    acknowledged_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_policy_acknowledgments OWNER TO postgres;

--
-- TOC entry 368 (class 1259 OID 18379)
-- Name: employee_policy_acknowledgments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_policy_acknowledgments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_policy_acknowledgments_id_seq OWNER TO postgres;

--
-- TOC entry 6673 (class 0 OID 0)
-- Dependencies: 368
-- Name: employee_policy_acknowledgments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_policy_acknowledgments_id_seq OWNED BY public.employee_policy_acknowledgments.id;


--
-- TOC entry 411 (class 1259 OID 18882)
-- Name: employee_profile_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_profile_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    field_name character varying(100) NOT NULL,
    old_value text,
    new_value text,
    changed_by integer,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_profile_history OWNER TO postgres;

--
-- TOC entry 410 (class 1259 OID 18881)
-- Name: employee_profile_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_profile_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_profile_history_id_seq OWNER TO postgres;

--
-- TOC entry 6674 (class 0 OID 0)
-- Dependencies: 410
-- Name: employee_profile_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_profile_history_id_seq OWNED BY public.employee_profile_history.id;


--
-- TOC entry 395 (class 1259 OID 18679)
-- Name: employee_reporting_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_reporting_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    manager_id integer,
    start_date date NOT NULL,
    end_date date,
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_reporting_history_check CHECK (((end_date IS NULL) OR (end_date >= start_date)))
);


ALTER TABLE public.employee_reporting_history OWNER TO postgres;

--
-- TOC entry 394 (class 1259 OID 18678)
-- Name: employee_reporting_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_reporting_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_reporting_history_id_seq OWNER TO postgres;

--
-- TOC entry 6675 (class 0 OID 0)
-- Dependencies: 394
-- Name: employee_reporting_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_reporting_history_id_seq OWNED BY public.employee_reporting_history.id;


--
-- TOC entry 407 (class 1259 OID 18835)
-- Name: employee_search_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_search_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    search_query character varying(255),
    filters jsonb,
    searched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_search_history OWNER TO postgres;

--
-- TOC entry 406 (class 1259 OID 18834)
-- Name: employee_search_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_search_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_search_history_id_seq OWNER TO postgres;

--
-- TOC entry 6676 (class 0 OID 0)
-- Dependencies: 406
-- Name: employee_search_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_search_history_id_seq OWNED BY public.employee_search_history.id;


--
-- TOC entry 337 (class 1259 OID 17977)
-- Name: employee_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_status_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    old_status character varying(30),
    new_status character varying(30) NOT NULL,
    effective_date date NOT NULL,
    reason text,
    changed_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_status_history OWNER TO postgres;

--
-- TOC entry 336 (class 1259 OID 17976)
-- Name: employee_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 6677 (class 0 OID 0)
-- Dependencies: 336
-- Name: employee_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_status_history_id_seq OWNED BY public.employee_status_history.id;


--
-- TOC entry 319 (class 1259 OID 17690)
-- Name: employee_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_transfers (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    from_department_id integer,
    to_department_id integer,
    from_designation_id integer,
    to_designation_id integer,
    from_branch_id integer,
    to_branch_id integer,
    from_team_id integer,
    to_team_id integer,
    transfer_date date NOT NULL,
    reason text,
    approved_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_transfers OWNER TO postgres;

--
-- TOC entry 318 (class 1259 OID 17689)
-- Name: employee_transfers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_transfers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_transfers_id_seq OWNER TO postgres;

--
-- TOC entry 6678 (class 0 OID 0)
-- Dependencies: 318
-- Name: employee_transfers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_transfers_id_seq OWNED BY public.employee_transfers.id;


--
-- TOC entry 343 (class 1259 OID 18043)
-- Name: employee_work_anniversaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_work_anniversaries (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    joining_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_work_anniversaries OWNER TO postgres;

--
-- TOC entry 342 (class 1259 OID 18042)
-- Name: employee_work_anniversaries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_work_anniversaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_work_anniversaries_id_seq OWNER TO postgres;

--
-- TOC entry 6679 (class 0 OID 0)
-- Dependencies: 342
-- Name: employee_work_anniversaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_work_anniversaries_id_seq OWNED BY public.employee_work_anniversaries.id;


--
-- TOC entry 397 (class 1259 OID 18703)
-- Name: employee_work_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_work_locations (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    branch_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    is_primary boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_work_locations_check CHECK (((end_date IS NULL) OR (end_date >= start_date)))
);


ALTER TABLE public.employee_work_locations OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 18702)
-- Name: employee_work_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_work_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_work_locations_id_seq OWNER TO postgres;

--
-- TOC entry 6680 (class 0 OID 0)
-- Dependencies: 396
-- Name: employee_work_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_work_locations_id_seq OWNED BY public.employee_work_locations.id;


--
-- TOC entry 237 (class 1259 OID 16543)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_id integer NOT NULL,
    employee_code character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    date_of_birth date,
    gender character varying(20),
    phone character varying(20),
    email character varying(150),
    address text,
    emergency_contact_name character varying(100),
    emergency_contact_phone character varying(20),
    emergency_contact_relationship character varying(50),
    department_id integer,
    designation_id integer,
    branch_id integer,
    team_id integer,
    reporting_manager_id integer,
    employment_type character varying(50),
    joining_date date NOT NULL,
    employment_status character varying(30) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16542)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 6681 (class 0 OID 0)
-- Dependencies: 236
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 399 (class 1259 OID 18727)
-- Name: employment_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employment_types (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employment_types OWNER TO postgres;

--
-- TOC entry 398 (class 1259 OID 18726)
-- Name: employment_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employment_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employment_types_id_seq OWNER TO postgres;

--
-- TOC entry 6682 (class 0 OID 0)
-- Dependencies: 398
-- Name: employment_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employment_types_id_seq OWNED BY public.employment_types.id;


--
-- TOC entry 279 (class 1259 OID 17187)
-- Name: exit_clearance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exit_clearance (
    id integer NOT NULL,
    resignation_id integer NOT NULL,
    department_clearance boolean DEFAULT false,
    asset_returned boolean DEFAULT false,
    finance_clearance boolean DEFAULT false,
    hr_clearance boolean DEFAULT false,
    clearance_status character varying(30) DEFAULT 'Pending'::character varying,
    cleared_by integer,
    cleared_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exit_clearance OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 17186)
-- Name: exit_clearance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exit_clearance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exit_clearance_id_seq OWNER TO postgres;

--
-- TOC entry 6683 (class 0 OID 0)
-- Dependencies: 278
-- Name: exit_clearance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exit_clearance_id_seq OWNED BY public.exit_clearance.id;


--
-- TOC entry 365 (class 1259 OID 18331)
-- Name: expense_approval_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_approval_history (
    id integer NOT NULL,
    expense_id integer NOT NULL,
    approver_id integer NOT NULL,
    action character varying(30) NOT NULL,
    comments text,
    action_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expense_approval_history_action_check CHECK (((action)::text = ANY ((ARRAY['Approved'::character varying, 'Rejected'::character varying, 'Returned'::character varying])::text[])))
);


ALTER TABLE public.expense_approval_history OWNER TO postgres;

--
-- TOC entry 364 (class 1259 OID 18330)
-- Name: expense_approval_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_approval_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_approval_history_id_seq OWNER TO postgres;

--
-- TOC entry 6684 (class 0 OID 0)
-- Dependencies: 364
-- Name: expense_approval_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_approval_history_id_seq OWNED BY public.expense_approval_history.id;


--
-- TOC entry 265 (class 1259 OID 16960)
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 16959)
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_categories_id_seq OWNER TO postgres;

--
-- TOC entry 6685 (class 0 OID 0)
-- Dependencies: 264
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;


--
-- TOC entry 267 (class 1259 OID 16982)
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    category_id integer NOT NULL,
    expense_date date NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    receipt_url character varying(500),
    status character varying(30) DEFAULT 'Pending'::character varying NOT NULL,
    approved_by integer,
    approved_at timestamp without time zone,
    rejection_reason text,
    reimbursement_status character varying(30) DEFAULT 'Pending'::character varying,
    reimbursed_amount numeric(12,2) DEFAULT 0,
    reimbursed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expenses_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT expenses_reimbursed_amount_check CHECK ((reimbursed_amount >= (0)::numeric))
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 16981)
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- TOC entry 6686 (class 0 OID 0)
-- Dependencies: 266
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- TOC entry 415 (class 1259 OID 18936)
-- Name: final_settlements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.final_settlements (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    resignation_id integer NOT NULL,
    salary_due numeric(12,2) DEFAULT 0,
    leave_encashment numeric(12,2) DEFAULT 0,
    bonus_due numeric(12,2) DEFAULT 0,
    deductions numeric(12,2) DEFAULT 0,
    total_settlement numeric(12,2) DEFAULT 0,
    settlement_date date,
    status character varying(30) DEFAULT 'Pending'::character varying,
    processed_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT final_settlements_bonus_due_check CHECK ((bonus_due >= (0)::numeric)),
    CONSTRAINT final_settlements_deductions_check CHECK ((deductions >= (0)::numeric)),
    CONSTRAINT final_settlements_leave_encashment_check CHECK ((leave_encashment >= (0)::numeric)),
    CONSTRAINT final_settlements_salary_due_check CHECK ((salary_due >= (0)::numeric)),
    CONSTRAINT final_settlements_total_settlement_check CHECK ((total_settlement >= (0)::numeric))
);


ALTER TABLE public.final_settlements OWNER TO postgres;

--
-- TOC entry 414 (class 1259 OID 18935)
-- Name: final_settlements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.final_settlements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.final_settlements_id_seq OWNER TO postgres;

--
-- TOC entry 6687 (class 0 OID 0)
-- Dependencies: 414
-- Name: final_settlements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.final_settlements_id_seq OWNED BY public.final_settlements.id;


--
-- TOC entry 251 (class 1259 OID 16770)
-- Name: holidays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.holidays (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(150) NOT NULL,
    holiday_date date NOT NULL,
    holiday_type character varying(50) DEFAULT 'Company'::character varying,
    description text,
    is_optional boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.holidays OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 16769)
-- Name: holidays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.holidays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.holidays_id_seq OWNER TO postgres;

--
-- TOC entry 6688 (class 0 OID 0)
-- Dependencies: 250
-- Name: holidays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.holidays_id_seq OWNED BY public.holidays.id;


--
-- TOC entry 325 (class 1259 OID 17806)
-- Name: hr_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    recipient_id integer NOT NULL,
    subject character varying(200) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hr_messages OWNER TO postgres;

--
-- TOC entry 324 (class 1259 OID 17805)
-- Name: hr_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_messages_id_seq OWNER TO postgres;

--
-- TOC entry 6689 (class 0 OID 0)
-- Dependencies: 324
-- Name: hr_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_messages_id_seq OWNED BY public.hr_messages.id;


--
-- TOC entry 321 (class 1259 OID 17753)
-- Name: hr_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_policies (
    id integer NOT NULL,
    company_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    policy_type character varying(100),
    effective_from date,
    effective_to date,
    document_url character varying(500),
    is_active boolean DEFAULT true,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hr_policies OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 17752)
-- Name: hr_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_policies_id_seq OWNER TO postgres;

--
-- TOC entry 6690 (class 0 OID 0)
-- Dependencies: 320
-- Name: hr_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_policies_id_seq OWNED BY public.hr_policies.id;


--
-- TOC entry 363 (class 1259 OID 18306)
-- Name: leave_approval_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_approval_history (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    approver_id integer NOT NULL,
    action character varying(30) NOT NULL,
    comments text,
    action_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leave_approval_history_action_check CHECK (((action)::text = ANY ((ARRAY['Approved'::character varying, 'Rejected'::character varying, 'Cancelled'::character varying, 'Returned'::character varying])::text[])))
);


ALTER TABLE public.leave_approval_history OWNER TO postgres;

--
-- TOC entry 362 (class 1259 OID 18305)
-- Name: leave_approval_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_approval_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_approval_history_id_seq OWNER TO postgres;

--
-- TOC entry 6691 (class 0 OID 0)
-- Dependencies: 362
-- Name: leave_approval_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_approval_history_id_seq OWNED BY public.leave_approval_history.id;


--
-- TOC entry 387 (class 1259 OID 18573)
-- Name: leave_calendar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_calendar (
    id integer NOT NULL,
    company_id integer NOT NULL,
    employee_id integer,
    leave_request_id integer,
    calendar_date date NOT NULL,
    leave_status character varying(30) DEFAULT 'Leave'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_calendar OWNER TO postgres;

--
-- TOC entry 386 (class 1259 OID 18572)
-- Name: leave_calendar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_calendar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_calendar_id_seq OWNER TO postgres;

--
-- TOC entry 6692 (class 0 OID 0)
-- Dependencies: 386
-- Name: leave_calendar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_calendar_id_seq OWNED BY public.leave_calendar.id;


--
-- TOC entry 331 (class 1259 OID 17892)
-- Name: leave_carry_forward; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_carry_forward (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    from_year integer NOT NULL,
    to_year integer NOT NULL,
    carried_forward_days numeric(5,2) DEFAULT 0 NOT NULL,
    used_days numeric(5,2) DEFAULT 0 NOT NULL,
    remaining_days numeric(5,2) DEFAULT 0 NOT NULL,
    expiry_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leave_carry_forward_carried_forward_days_check CHECK ((carried_forward_days >= (0)::numeric)),
    CONSTRAINT leave_carry_forward_check CHECK ((to_year > from_year)),
    CONSTRAINT leave_carry_forward_remaining_days_check CHECK ((remaining_days >= (0)::numeric)),
    CONSTRAINT leave_carry_forward_used_days_check CHECK ((used_days >= (0)::numeric))
);


ALTER TABLE public.leave_carry_forward OWNER TO postgres;

--
-- TOC entry 330 (class 1259 OID 17891)
-- Name: leave_carry_forward_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_carry_forward_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_carry_forward_id_seq OWNER TO postgres;

--
-- TOC entry 6693 (class 0 OID 0)
-- Dependencies: 330
-- Name: leave_carry_forward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_carry_forward_id_seq OWNED BY public.leave_carry_forward.id;


--
-- TOC entry 247 (class 1259 OID 16705)
-- Name: leave_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_policies (
    id integer NOT NULL,
    company_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    annual_allocation integer DEFAULT 0,
    monthly_accrual numeric(5,2) DEFAULT 0,
    requires_approval boolean DEFAULT true,
    allow_negative_balance boolean DEFAULT false,
    effective_from date,
    effective_to date,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_policies OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16704)
-- Name: leave_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_policies_id_seq OWNER TO postgres;

--
-- TOC entry 6694 (class 0 OID 0)
-- Dependencies: 246
-- Name: leave_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_policies_id_seq OWNED BY public.leave_policies.id;


--
-- TOC entry 381 (class 1259 OID 18495)
-- Name: leave_policy_acknowledgments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_policy_acknowledgments (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    leave_policy_id integer NOT NULL,
    acknowledged_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_policy_acknowledgments OWNER TO postgres;

--
-- TOC entry 380 (class 1259 OID 18494)
-- Name: leave_policy_acknowledgments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_policy_acknowledgments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_policy_acknowledgments_id_seq OWNER TO postgres;

--
-- TOC entry 6695 (class 0 OID 0)
-- Dependencies: 380
-- Name: leave_policy_acknowledgments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_policy_acknowledgments_id_seq OWNED BY public.leave_policy_acknowledgments.id;


--
-- TOC entry 249 (class 1259 OID 16734)
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days numeric(5,2) NOT NULL,
    reason text,
    status character varying(30) DEFAULT 'Pending'::character varying NOT NULL,
    approved_by integer,
    approved_at timestamp without time zone,
    rejection_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leave_requests_check CHECK ((end_date >= start_date)),
    CONSTRAINT leave_requests_total_days_check CHECK ((total_days > (0)::numeric))
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16733)
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_requests_id_seq OWNER TO postgres;

--
-- TOC entry 6696 (class 0 OID 0)
-- Dependencies: 248
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- TOC entry 305 (class 1259 OID 17537)
-- Name: leave_supporting_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_supporting_documents (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    document_name character varying(200) NOT NULL,
    file_url character varying(500) NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_supporting_documents OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 17536)
-- Name: leave_supporting_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_supporting_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_supporting_documents_id_seq OWNER TO postgres;

--
-- TOC entry 6697 (class 0 OID 0)
-- Dependencies: 304
-- Name: leave_supporting_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_supporting_documents_id_seq OWNED BY public.leave_supporting_documents.id;


--
-- TOC entry 245 (class 1259 OID 16680)
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_paid boolean DEFAULT true,
    max_days_per_year integer,
    carry_forward_allowed boolean DEFAULT false,
    max_carry_forward_days integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16679)
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_types_id_seq OWNER TO postgres;

--
-- TOC entry 6698 (class 0 OID 0)
-- Dependencies: 244
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- TOC entry 299 (class 1259 OID 17478)
-- Name: login_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    logout_time timestamp without time zone,
    ip_address character varying(45),
    user_agent text,
    login_status character varying(30) DEFAULT 'Success'::character varying
);


ALTER TABLE public.login_history OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 17477)
-- Name: login_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_history_id_seq OWNER TO postgres;

--
-- TOC entry 6699 (class 0 OID 0)
-- Dependencies: 298
-- Name: login_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_history_id_seq OWNED BY public.login_history.id;


--
-- TOC entry 311 (class 1259 OID 17592)
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_settings (
    id integer NOT NULL,
    company_id integer NOT NULL,
    notification_type character varying(100) NOT NULL,
    email_enabled boolean DEFAULT true,
    in_app_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notification_settings OWNER TO postgres;

--
-- TOC entry 310 (class 1259 OID 17591)
-- Name: notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_settings_id_seq OWNER TO postgres;

--
-- TOC entry 6700 (class 0 OID 0)
-- Dependencies: 310
-- Name: notification_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_settings_id_seq OWNED BY public.notification_settings.id;


--
-- TOC entry 293 (class 1259 OID 17420)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(200) NOT NULL,
    message text NOT NULL,
    notification_type character varying(50),
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 17419)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 6701 (class 0 OID 0)
-- Dependencies: 292
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 281 (class 1259 OID 17215)
-- Name: offboarding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offboarding (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    resignation_id integer NOT NULL,
    clearance_id integer,
    exit_interview_date date,
    exit_interview_notes text,
    final_settlement_amount numeric(12,2) DEFAULT 0,
    final_settlement_date date,
    experience_letter_url character varying(500),
    relieving_letter_url character varying(500),
    status character varying(30) DEFAULT 'In Progress'::character varying,
    completed_by integer,
    completed_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT offboarding_final_settlement_amount_check CHECK ((final_settlement_amount >= (0)::numeric))
);


ALTER TABLE public.offboarding OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 17214)
-- Name: offboarding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offboarding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offboarding_id_seq OWNER TO postgres;

--
-- TOC entry 6702 (class 0 OID 0)
-- Dependencies: 280
-- Name: offboarding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offboarding_id_seq OWNED BY public.offboarding.id;


--
-- TOC entry 273 (class 1259 OID 17074)
-- Name: onboarding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.onboarding (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    start_date date,
    expected_completion_date date,
    actual_completion_date date,
    status character varying(30) DEFAULT 'Not Started'::character varying,
    assigned_hr integer,
    assigned_manager integer,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.onboarding OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 17073)
-- Name: onboarding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.onboarding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.onboarding_id_seq OWNER TO postgres;

--
-- TOC entry 6703 (class 0 OID 0)
-- Dependencies: 272
-- Name: onboarding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.onboarding_id_seq OWNED BY public.onboarding.id;


--
-- TOC entry 275 (class 1259 OID 17105)
-- Name: onboarding_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.onboarding_tasks (
    id integer NOT NULL,
    onboarding_id integer NOT NULL,
    task_name character varying(200) NOT NULL,
    description text,
    assigned_to integer,
    due_date date,
    completed_at timestamp without time zone,
    status character varying(30) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.onboarding_tasks OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 17104)
-- Name: onboarding_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.onboarding_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.onboarding_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 6704 (class 0 OID 0)
-- Dependencies: 274
-- Name: onboarding_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.onboarding_tasks_id_seq OWNED BY public.onboarding_tasks.id;


--
-- TOC entry 377 (class 1259 OID 18458)
-- Name: password_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    password_hash character varying(255) NOT NULL,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_history OWNER TO postgres;

--
-- TOC entry 376 (class 1259 OID 18457)
-- Name: password_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_history_id_seq OWNER TO postgres;

--
-- TOC entry 6705 (class 0 OID 0)
-- Dependencies: 376
-- Name: password_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_history_id_seq OWNED BY public.password_history.id;


--
-- TOC entry 295 (class 1259 OID 17440)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 17439)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 6706 (class 0 OID 0)
-- Dependencies: 294
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 261 (class 1259 OID 16896)
-- Name: payroll; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    payroll_month integer NOT NULL,
    payroll_year integer NOT NULL,
    basic_salary numeric(12,2) DEFAULT 0,
    total_earnings numeric(12,2) DEFAULT 0,
    total_deductions numeric(12,2) DEFAULT 0,
    overtime_amount numeric(12,2) DEFAULT 0,
    bonus_amount numeric(12,2) DEFAULT 0,
    gross_salary numeric(12,2) DEFAULT 0,
    net_salary numeric(12,2) DEFAULT 0,
    working_days integer DEFAULT 0,
    paid_days numeric(5,2) DEFAULT 0,
    unpaid_days numeric(5,2) DEFAULT 0,
    status character varying(30) DEFAULT 'Draft'::character varying,
    processed_by integer,
    processed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payroll_basic_salary_check CHECK ((basic_salary >= (0)::numeric)),
    CONSTRAINT payroll_net_salary_check CHECK ((net_salary >= (0)::numeric)),
    CONSTRAINT payroll_payroll_month_check CHECK (((payroll_month >= 1) AND (payroll_month <= 12))),
    CONSTRAINT payroll_payroll_year_check CHECK ((payroll_year >= 2000)),
    CONSTRAINT payroll_total_deductions_check CHECK ((total_deductions >= (0)::numeric)),
    CONSTRAINT payroll_total_earnings_check CHECK ((total_earnings >= (0)::numeric))
);


ALTER TABLE public.payroll OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 16895)
-- Name: payroll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payroll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_id_seq OWNER TO postgres;

--
-- TOC entry 6707 (class 0 OID 0)
-- Dependencies: 260
-- Name: payroll_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payroll_id_seq OWNED BY public.payroll.id;


--
-- TOC entry 263 (class 1259 OID 16938)
-- Name: payroll_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll_items (
    id integer NOT NULL,
    payroll_id integer NOT NULL,
    component_name character varying(100) NOT NULL,
    component_type character varying(30) NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payroll_items_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT payroll_items_component_type_check CHECK (((component_type)::text = ANY ((ARRAY['Earning'::character varying, 'Deduction'::character varying])::text[])))
);


ALTER TABLE public.payroll_items OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 16937)
-- Name: payroll_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payroll_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_items_id_seq OWNER TO postgres;

--
-- TOC entry 6708 (class 0 OID 0)
-- Dependencies: 262
-- Name: payroll_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payroll_items_id_seq OWNED BY public.payroll_items.id;


--
-- TOC entry 359 (class 1259 OID 18249)
-- Name: payroll_tax_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll_tax_details (
    id integer NOT NULL,
    payroll_id integer NOT NULL,
    taxable_income numeric(12,2) DEFAULT 0,
    tax_amount numeric(12,2) DEFAULT 0,
    provident_fund numeric(12,2) DEFAULT 0,
    professional_tax numeric(12,2) DEFAULT 0,
    other_statutory_deductions numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payroll_tax_details_other_statutory_deductions_check CHECK ((other_statutory_deductions >= (0)::numeric)),
    CONSTRAINT payroll_tax_details_professional_tax_check CHECK ((professional_tax >= (0)::numeric)),
    CONSTRAINT payroll_tax_details_provident_fund_check CHECK ((provident_fund >= (0)::numeric)),
    CONSTRAINT payroll_tax_details_tax_amount_check CHECK ((tax_amount >= (0)::numeric)),
    CONSTRAINT payroll_tax_details_taxable_income_check CHECK ((taxable_income >= (0)::numeric))
);


ALTER TABLE public.payroll_tax_details OWNER TO postgres;

--
-- TOC entry 358 (class 1259 OID 18248)
-- Name: payroll_tax_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payroll_tax_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_tax_details_id_seq OWNER TO postgres;

--
-- TOC entry 6709 (class 0 OID 0)
-- Dependencies: 358
-- Name: payroll_tax_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payroll_tax_details_id_seq OWNED BY public.payroll_tax_details.id;


--
-- TOC entry 333 (class 1259 OID 17928)
-- Name: payslips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payslips (
    id integer NOT NULL,
    payroll_id integer NOT NULL,
    employee_id integer NOT NULL,
    payslip_number character varying(100) NOT NULL,
    payslip_url character varying(500),
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payslips OWNER TO postgres;

--
-- TOC entry 332 (class 1259 OID 17927)
-- Name: payslips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payslips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payslips_id_seq OWNER TO postgres;

--
-- TOC entry 6710 (class 0 OID 0)
-- Dependencies: 332
-- Name: payslips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payslips_id_seq OWNED BY public.payslips.id;


--
-- TOC entry 283 (class 1259 OID 17258)
-- Name: performance_cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_cycles (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(30) DEFAULT 'Planned'::character varying,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_cycles_check CHECK ((end_date >= start_date))
);


ALTER TABLE public.performance_cycles OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17257)
-- Name: performance_cycles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_cycles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_cycles_id_seq OWNER TO postgres;

--
-- TOC entry 6711 (class 0 OID 0)
-- Dependencies: 282
-- Name: performance_cycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_cycles_id_seq OWNED BY public.performance_cycles.id;


--
-- TOC entry 289 (class 1259 OID 17354)
-- Name: performance_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_feedback (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    cycle_id integer NOT NULL,
    reviewer_id integer,
    feedback text NOT NULL,
    rating numeric(4,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_feedback_rating_check CHECK (((rating IS NULL) OR ((rating >= (0)::numeric) AND (rating <= (5)::numeric))))
);


ALTER TABLE public.performance_feedback OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17353)
-- Name: performance_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_feedback_id_seq OWNER TO postgres;

--
-- TOC entry 6712 (class 0 OID 0)
-- Dependencies: 288
-- Name: performance_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_feedback_id_seq OWNED BY public.performance_feedback.id;


--
-- TOC entry 389 (class 1259 OID 18603)
-- Name: performance_goal_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_goal_history (
    id integer NOT NULL,
    goal_id integer NOT NULL,
    employee_id integer NOT NULL,
    old_status character varying(30),
    new_status character varying(30),
    old_achieved_value character varying(100),
    new_achieved_value character varying(100),
    changed_by integer,
    change_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.performance_goal_history OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 18602)
-- Name: performance_goal_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_goal_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_goal_history_id_seq OWNER TO postgres;

--
-- TOC entry 6713 (class 0 OID 0)
-- Dependencies: 388
-- Name: performance_goal_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_goal_history_id_seq OWNED BY public.performance_goal_history.id;


--
-- TOC entry 391 (class 1259 OID 18632)
-- Name: performance_goal_kpis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_goal_kpis (
    id integer NOT NULL,
    goal_id integer NOT NULL,
    kpi_name character varying(150) NOT NULL,
    description text,
    target_value character varying(100),
    measurement_unit character varying(50),
    weight_percentage numeric(5,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_goal_kpis_weight_percentage_check CHECK (((weight_percentage >= (0)::numeric) AND (weight_percentage <= (100)::numeric)))
);


ALTER TABLE public.performance_goal_kpis OWNER TO postgres;

--
-- TOC entry 390 (class 1259 OID 18631)
-- Name: performance_goal_kpis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_goal_kpis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_goal_kpis_id_seq OWNER TO postgres;

--
-- TOC entry 6714 (class 0 OID 0)
-- Dependencies: 390
-- Name: performance_goal_kpis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_goal_kpis_id_seq OWNED BY public.performance_goal_kpis.id;


--
-- TOC entry 285 (class 1259 OID 17286)
-- Name: performance_goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_goals (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    cycle_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    kpi_name character varying(150),
    target_value character varying(100),
    achieved_value character varying(100),
    weight_percentage numeric(5,2) DEFAULT 0,
    status character varying(30) DEFAULT 'Not Started'::character varying,
    start_date date,
    due_date date,
    completed_at timestamp without time zone,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_goals_check CHECK (((due_date IS NULL) OR (start_date IS NULL) OR (due_date >= start_date))),
    CONSTRAINT performance_goals_weight_percentage_check CHECK (((weight_percentage >= (0)::numeric) AND (weight_percentage <= (100)::numeric)))
);


ALTER TABLE public.performance_goals OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17285)
-- Name: performance_goals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_goals_id_seq OWNER TO postgres;

--
-- TOC entry 6715 (class 0 OID 0)
-- Dependencies: 284
-- Name: performance_goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_goals_id_seq OWNED BY public.performance_goals.id;


--
-- TOC entry 353 (class 1259 OID 18171)
-- Name: performance_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_history (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    cycle_id integer NOT NULL,
    review_id integer,
    final_rating numeric(4,2),
    performance_level character varying(50),
    final_comments text,
    recorded_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_history_final_rating_check CHECK (((final_rating IS NULL) OR ((final_rating >= (0)::numeric) AND (final_rating <= (5)::numeric))))
);


ALTER TABLE public.performance_history OWNER TO postgres;

--
-- TOC entry 352 (class 1259 OID 18170)
-- Name: performance_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_history_id_seq OWNER TO postgres;

--
-- TOC entry 6716 (class 0 OID 0)
-- Dependencies: 352
-- Name: performance_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_history_id_seq OWNED BY public.performance_history.id;


--
-- TOC entry 287 (class 1259 OID 17321)
-- Name: performance_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_reviews (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    cycle_id integer NOT NULL,
    reviewer_id integer,
    review_type character varying(30) NOT NULL,
    overall_rating numeric(4,2),
    strengths text,
    areas_for_improvement text,
    employee_comments text,
    manager_comments text,
    status character varying(30) DEFAULT 'Pending'::character varying,
    submitted_at timestamp without time zone,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT performance_reviews_overall_rating_check CHECK (((overall_rating IS NULL) OR ((overall_rating >= (0)::numeric) AND (overall_rating <= (5)::numeric)))),
    CONSTRAINT performance_reviews_review_type_check CHECK (((review_type)::text = ANY ((ARRAY['Self Assessment'::character varying, 'Manager Assessment'::character varying])::text[])))
);


ALTER TABLE public.performance_reviews OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17320)
-- Name: performance_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.performance_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.performance_reviews_id_seq OWNER TO postgres;

--
-- TOC entry 6717 (class 0 OID 0)
-- Dependencies: 286
-- Name: performance_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.performance_reviews_id_seq OWNED BY public.performance_reviews.id;


--
-- TOC entry 317 (class 1259 OID 17665)
-- Name: permission_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission_configuration (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    is_allowed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permission_configuration OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 17664)
-- Name: permission_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permission_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permission_configuration_id_seq OWNER TO postgres;

--
-- TOC entry 6718 (class 0 OID 0)
-- Dependencies: 316
-- Name: permission_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permission_configuration_id_seq OWNED BY public.permission_configuration.id;


--
-- TOC entry 222 (class 1259 OID 16404)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- TOC entry 6719 (class 0 OID 0)
-- Dependencies: 221
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- TOC entry 375 (class 1259 OID 18440)
-- Name: regional_holidays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regional_holidays (
    id integer NOT NULL,
    holiday_id integer NOT NULL,
    region character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.regional_holidays OWNER TO postgres;

--
-- TOC entry 374 (class 1259 OID 18439)
-- Name: regional_holidays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.regional_holidays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.regional_holidays_id_seq OWNER TO postgres;

--
-- TOC entry 6720 (class 0 OID 0)
-- Dependencies: 374
-- Name: regional_holidays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.regional_holidays_id_seq OWNED BY public.regional_holidays.id;


--
-- TOC entry 373 (class 1259 OID 18420)
-- Name: report_exports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_exports (
    id integer NOT NULL,
    user_id integer NOT NULL,
    report_type character varying(100) NOT NULL,
    file_format character varying(20) NOT NULL,
    file_url character varying(500),
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT report_exports_file_format_check CHECK (((file_format)::text = ANY ((ARRAY['CSV'::character varying, 'Excel'::character varying, 'PDF'::character varying])::text[])))
);


ALTER TABLE public.report_exports OWNER TO postgres;

--
-- TOC entry 372 (class 1259 OID 18419)
-- Name: report_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_exports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_exports_id_seq OWNER TO postgres;

--
-- TOC entry 6721 (class 0 OID 0)
-- Dependencies: 372
-- Name: report_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_exports_id_seq OWNED BY public.report_exports.id;


--
-- TOC entry 277 (class 1259 OID 17130)
-- Name: resignations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resignations (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    resignation_date date NOT NULL,
    last_working_date date,
    reason text,
    status character varying(30) DEFAULT 'Pending'::character varying,
    approved_by integer,
    approved_at timestamp without time zone,
    rejection_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT resignations_check CHECK (((last_working_date IS NULL) OR (last_working_date >= resignation_date)))
);


ALTER TABLE public.resignations OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 17129)
-- Name: resignations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resignations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resignations_id_seq OWNER TO postgres;

--
-- TOC entry 6722 (class 0 OID 0)
-- Dependencies: 276
-- Name: resignations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resignations_id_seq OWNED BY public.resignations.id;


--
-- TOC entry 315 (class 1259 OID 17638)
-- Name: role_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_configuration (
    id integer NOT NULL,
    role_id integer NOT NULL,
    can_manage_users boolean DEFAULT false,
    can_manage_employees boolean DEFAULT false,
    can_manage_attendance boolean DEFAULT false,
    can_manage_leave boolean DEFAULT false,
    can_manage_payroll boolean DEFAULT false,
    can_manage_expenses boolean DEFAULT false,
    can_manage_documents boolean DEFAULT false,
    can_manage_performance boolean DEFAULT false,
    can_view_reports boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.role_configuration OWNER TO postgres;

--
-- TOC entry 314 (class 1259 OID 17637)
-- Name: role_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_configuration_id_seq OWNER TO postgres;

--
-- TOC entry 6723 (class 0 OID 0)
-- Dependencies: 314
-- Name: role_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_configuration_id_seq OWNED BY public.role_configuration.id;


--
-- TOC entry 223 (class 1259 OID 16417)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 6724 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 257 (class 1259 OID 16845)
-- Name: salary_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_components (
    id integer NOT NULL,
    salary_structure_id integer NOT NULL,
    component_name character varying(100) NOT NULL,
    component_type character varying(30) NOT NULL,
    calculation_type character varying(30) DEFAULT 'Fixed'::character varying,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    percentage numeric(5,2),
    is_taxable boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_components_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT salary_components_calculation_type_check CHECK (((calculation_type)::text = ANY ((ARRAY['Fixed'::character varying, 'Percentage'::character varying])::text[]))),
    CONSTRAINT salary_components_component_type_check CHECK (((component_type)::text = ANY ((ARRAY['Earning'::character varying, 'Deduction'::character varying])::text[]))),
    CONSTRAINT salary_components_percentage_check CHECK (((percentage IS NULL) OR (percentage >= (0)::numeric)))
);


ALTER TABLE public.salary_components OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 16844)
-- Name: salary_components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salary_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salary_components_id_seq OWNER TO postgres;

--
-- TOC entry 6725 (class 0 OID 0)
-- Dependencies: 256
-- Name: salary_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salary_components_id_seq OWNED BY public.salary_components.id;


--
-- TOC entry 259 (class 1259 OID 16871)
-- Name: salary_revisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_revisions (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    previous_salary numeric(12,2) NOT NULL,
    new_salary numeric(12,2) NOT NULL,
    revision_date date NOT NULL,
    reason character varying(255),
    approved_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_revisions_new_salary_check CHECK ((new_salary >= (0)::numeric)),
    CONSTRAINT salary_revisions_previous_salary_check CHECK ((previous_salary >= (0)::numeric))
);


ALTER TABLE public.salary_revisions OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 16870)
-- Name: salary_revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salary_revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salary_revisions_id_seq OWNER TO postgres;

--
-- TOC entry 6726 (class 0 OID 0)
-- Dependencies: 258
-- Name: salary_revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salary_revisions_id_seq OWNED BY public.salary_revisions.id;


--
-- TOC entry 255 (class 1259 OID 16819)
-- Name: salary_structures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_structures (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    effective_from date NOT NULL,
    effective_to date,
    basic_salary numeric(12,2) DEFAULT 0 NOT NULL,
    gross_salary numeric(12,2) DEFAULT 0 NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying,
    status character varying(30) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_structures_basic_salary_check CHECK ((basic_salary >= (0)::numeric)),
    CONSTRAINT salary_structures_check CHECK (((effective_to IS NULL) OR (effective_to >= effective_from))),
    CONSTRAINT salary_structures_gross_salary_check CHECK ((gross_salary >= (0)::numeric))
);


ALTER TABLE public.salary_structures OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 16818)
-- Name: salary_structures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salary_structures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salary_structures_id_seq OWNER TO postgres;

--
-- TOC entry 6727 (class 0 OID 0)
-- Dependencies: 254
-- Name: salary_structures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salary_structures_id_seq OWNED BY public.salary_structures.id;


--
-- TOC entry 241 (class 1259 OID 16624)
-- Name: shifts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shifts (
    id integer NOT NULL,
    company_id integer NOT NULL,
    name character varying(100) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    grace_minutes integer DEFAULT 0,
    break_minutes integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shifts OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16623)
-- Name: shifts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shifts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shifts_id_seq OWNER TO postgres;

--
-- TOC entry 6728 (class 0 OID 0)
-- Dependencies: 240
-- Name: shifts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shifts_id_seq OWNED BY public.shifts.id;


--
-- TOC entry 371 (class 1259 OID 18403)
-- Name: system_activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_activity_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    module character varying(100),
    description text,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_activity_logs OWNER TO postgres;

--
-- TOC entry 370 (class 1259 OID 18402)
-- Name: system_activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_activity_logs_id_seq OWNER TO postgres;

--
-- TOC entry 6729 (class 0 OID 0)
-- Dependencies: 370
-- Name: system_activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_activity_logs_id_seq OWNED BY public.system_activity_logs.id;


--
-- TOC entry 309 (class 1259 OID 17577)
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    id integer NOT NULL,
    setting_name character varying(100) NOT NULL,
    setting_value text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 17576)
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_settings_id_seq OWNER TO postgres;

--
-- TOC entry 6730 (class 0 OID 0)
-- Dependencies: 308
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_settings_id_seq OWNED BY public.system_settings.id;


--
-- TOC entry 235 (class 1259 OID 16524)
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    department_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16523)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- TOC entry 6731 (class 0 OID 0)
-- Dependencies: 234
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- TOC entry 225 (class 1259 OID 16435)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16434)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 6732 (class 0 OID 0)
-- Dependencies: 224
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 253 (class 1259 OID 16794)
-- Name: weekly_offs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_offs (
    id integer NOT NULL,
    company_id integer NOT NULL,
    day_of_week integer NOT NULL,
    branch_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT weekly_offs_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


ALTER TABLE public.weekly_offs OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16793)
-- Name: weekly_offs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.weekly_offs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weekly_offs_id_seq OWNER TO postgres;

--
-- TOC entry 6733 (class 0 OID 0)
-- Dependencies: 252
-- Name: weekly_offs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.weekly_offs_id_seq OWNED BY public.weekly_offs.id;


--
-- TOC entry 5632 (class 2604 OID 18204)
-- Name: announcement_recipients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcement_recipients ALTER COLUMN id SET DEFAULT nextval('public.announcement_recipients_id_seq'::regclass);


--
-- TOC entry 5510 (class 2604 OID 17388)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- TOC entry 5628 (class 2604 OID 18146)
-- Name: approval_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_actions ALTER COLUMN id SET DEFAULT nextval('public.approval_actions_id_seq'::regclass);


--
-- TOC entry 5623 (class 2604 OID 18120)
-- Name: approval_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests ALTER COLUMN id SET DEFAULT nextval('public.approval_requests_id_seq'::regclass);


--
-- TOC entry 5620 (class 2604 OID 18095)
-- Name: approval_workflow_steps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps ALTER COLUMN id SET DEFAULT nextval('public.approval_workflow_steps_id_seq'::regclass);


--
-- TOC entry 5616 (class 2604 OID 18066)
-- Name: approval_workflows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows ALTER COLUMN id SET DEFAULT nextval('public.approval_workflows_id_seq'::regclass);


--
-- TOC entry 5586 (class 2604 OID 17835)
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- TOC entry 5382 (class 2604 OID 16650)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- TOC entry 5675 (class 2604 OID 18550)
-- Name: attendance_calendar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_calendar ALTER COLUMN id SET DEFAULT nextval('public.attendance_calendar_id_seq'::regclass);


--
-- TOC entry 5590 (class 2604 OID 17864)
-- Name: attendance_corrections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_corrections ALTER COLUMN id SET DEFAULT nextval('public.attendance_corrections_id_seq'::regclass);


--
-- TOC entry 5528 (class 2604 OID 17516)
-- Name: attendance_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_rules ALTER COLUMN id SET DEFAULT nextval('public.attendance_rules_id_seq'::regclass);


--
-- TOC entry 5673 (class 2604 OID 18521)
-- Name: attendance_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_status_history ALTER COLUMN id SET DEFAULT nextval('public.attendance_status_history_id_seq'::regclass);


--
-- TOC entry 5526 (class 2604 OID 17499)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 5366 (class 2604 OID 16509)
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- TOC entry 5359 (class 2604 OID 16462)
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- TOC entry 5635 (class 2604 OID 18228)
-- Name: company_event_participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_event_participants ALTER COLUMN id SET DEFAULT nextval('public.company_event_participants_id_seq'::regclass);


--
-- TOC entry 5579 (class 2604 OID 17782)
-- Name: company_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_events ALTER COLUMN id SET DEFAULT nextval('public.company_events_id_seq'::regclass);


--
-- TOC entry 5540 (class 2604 OID 17559)
-- Name: company_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings ALTER COLUMN id SET DEFAULT nextval('public.company_settings_id_seq'::regclass);


--
-- TOC entry 5608 (class 2604 OID 18004)
-- Name: department_holidays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_holidays ALTER COLUMN id SET DEFAULT nextval('public.department_holidays_id_seq'::regclass);


--
-- TOC entry 5362 (class 2604 OID 16475)
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- TOC entry 5364 (class 2604 OID 16495)
-- Name: designations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.designations ALTER COLUMN id SET DEFAULT nextval('public.designations_id_seq'::regclass);


--
-- TOC entry 5654 (class 2604 OID 18359)
-- Name: document_activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_activity_logs ALTER COLUMN id SET DEFAULT nextval('public.document_activity_logs_id_seq'::regclass);


--
-- TOC entry 5460 (class 2604 OID 17022)
-- Name: document_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories ALTER COLUMN id SET DEFAULT nextval('public.document_categories_id_seq'::regclass);


--
-- TOC entry 5551 (class 2604 OID 17616)
-- Name: document_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_settings ALTER COLUMN id SET DEFAULT nextval('public.document_settings_id_seq'::regclass);


--
-- TOC entry 5464 (class 2604 OID 17044)
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- TOC entry 5521 (class 2604 OID 17462)
-- Name: email_verification_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.email_verification_tokens_id_seq'::regclass);


--
-- TOC entry 5646 (class 2604 OID 18280)
-- Name: employee_assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assets ALTER COLUMN id SET DEFAULT nextval('public.employee_assets_id_seq'::regclass);


--
-- TOC entry 5730 (class 2604 OID 18979)
-- Name: employee_bank_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_accounts ALTER COLUMN id SET DEFAULT nextval('public.employee_bank_accounts_id_seq'::regclass);


--
-- TOC entry 5610 (class 2604 OID 18027)
-- Name: employee_birthdays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_birthdays ALTER COLUMN id SET DEFAULT nextval('public.employee_birthdays_id_seq'::regclass);


--
-- TOC entry 5712 (class 2604 OID 18855)
-- Name: employee_documents_access id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access ALTER COLUMN id SET DEFAULT nextval('public.employee_documents_access_id_seq'::regclass);


--
-- TOC entry 5602 (class 2604 OID 17959)
-- Name: employee_emergency_contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_emergency_contacts ALTER COLUMN id SET DEFAULT nextval('public.employee_emergency_contacts_id_seq'::regclass);


--
-- TOC entry 5701 (class 2604 OID 18752)
-- Name: employee_employment_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history ALTER COLUMN id SET DEFAULT nextval('public.employee_employment_history_id_seq'::regclass);


--
-- TOC entry 5718 (class 2604 OID 18908)
-- Name: employee_exit_interviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews ALTER COLUMN id SET DEFAULT nextval('public.employee_exit_interviews_id_seq'::regclass);


--
-- TOC entry 5374 (class 2604 OID 16603)
-- Name: employee_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history ALTER COLUMN id SET DEFAULT nextval('public.employee_history_id_seq'::regclass);


--
-- TOC entry 5706 (class 2604 OID 18818)
-- Name: employee_invitation_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitation_tasks ALTER COLUMN id SET DEFAULT nextval('public.employee_invitation_tasks_id_seq'::regclass);


--
-- TOC entry 5703 (class 2604 OID 18791)
-- Name: employee_invitations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitations ALTER COLUMN id SET DEFAULT nextval('public.employee_invitations_id_seq'::regclass);


--
-- TOC entry 5666 (class 2604 OID 18478)
-- Name: employee_login_security id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_login_security ALTER COLUMN id SET DEFAULT nextval('public.employee_login_security_id_seq'::regclass);


--
-- TOC entry 5688 (class 2604 OID 18656)
-- Name: employee_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_notes ALTER COLUMN id SET DEFAULT nextval('public.employee_notes_id_seq'::regclass);


--
-- TOC entry 5656 (class 2604 OID 18383)
-- Name: employee_policy_acknowledgments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_policy_acknowledgments ALTER COLUMN id SET DEFAULT nextval('public.employee_policy_acknowledgments_id_seq'::regclass);


--
-- TOC entry 5716 (class 2604 OID 18885)
-- Name: employee_profile_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile_history ALTER COLUMN id SET DEFAULT nextval('public.employee_profile_history_id_seq'::regclass);


--
-- TOC entry 5692 (class 2604 OID 18682)
-- Name: employee_reporting_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_reporting_history ALTER COLUMN id SET DEFAULT nextval('public.employee_reporting_history_id_seq'::regclass);


--
-- TOC entry 5710 (class 2604 OID 18838)
-- Name: employee_search_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_search_history ALTER COLUMN id SET DEFAULT nextval('public.employee_search_history_id_seq'::regclass);


--
-- TOC entry 5606 (class 2604 OID 17980)
-- Name: employee_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status_history ALTER COLUMN id SET DEFAULT nextval('public.employee_status_history_id_seq'::regclass);


--
-- TOC entry 5573 (class 2604 OID 17693)
-- Name: employee_transfers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers ALTER COLUMN id SET DEFAULT nextval('public.employee_transfers_id_seq'::regclass);


--
-- TOC entry 5613 (class 2604 OID 18046)
-- Name: employee_work_anniversaries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_anniversaries ALTER COLUMN id SET DEFAULT nextval('public.employee_work_anniversaries_id_seq'::regclass);


--
-- TOC entry 5694 (class 2604 OID 18706)
-- Name: employee_work_locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_locations ALTER COLUMN id SET DEFAULT nextval('public.employee_work_locations_id_seq'::regclass);


--
-- TOC entry 5370 (class 2604 OID 16546)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 5697 (class 2604 OID 18730)
-- Name: employment_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_types ALTER COLUMN id SET DEFAULT nextval('public.employment_types_id_seq'::regclass);


--
-- TOC entry 5481 (class 2604 OID 17190)
-- Name: exit_clearance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_clearance ALTER COLUMN id SET DEFAULT nextval('public.exit_clearance_id_seq'::regclass);


--
-- TOC entry 5652 (class 2604 OID 18334)
-- Name: expense_approval_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_approval_history ALTER COLUMN id SET DEFAULT nextval('public.expense_approval_history_id_seq'::regclass);


--
-- TOC entry 5450 (class 2604 OID 16963)
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- TOC entry 5454 (class 2604 OID 16985)
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- TOC entry 5721 (class 2604 OID 18939)
-- Name: final_settlements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements ALTER COLUMN id SET DEFAULT nextval('public.final_settlements_id_seq'::regclass);


--
-- TOC entry 5410 (class 2604 OID 16773)
-- Name: holidays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays ALTER COLUMN id SET DEFAULT nextval('public.holidays_id_seq'::regclass);


--
-- TOC entry 5583 (class 2604 OID 17809)
-- Name: hr_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_messages ALTER COLUMN id SET DEFAULT nextval('public.hr_messages_id_seq'::regclass);


--
-- TOC entry 5575 (class 2604 OID 17756)
-- Name: hr_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_policies ALTER COLUMN id SET DEFAULT nextval('public.hr_policies_id_seq'::regclass);


--
-- TOC entry 5650 (class 2604 OID 18309)
-- Name: leave_approval_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approval_history ALTER COLUMN id SET DEFAULT nextval('public.leave_approval_history_id_seq'::regclass);


--
-- TOC entry 5679 (class 2604 OID 18576)
-- Name: leave_calendar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar ALTER COLUMN id SET DEFAULT nextval('public.leave_calendar_id_seq'::regclass);


--
-- TOC entry 5594 (class 2604 OID 17895)
-- Name: leave_carry_forward id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_carry_forward ALTER COLUMN id SET DEFAULT nextval('public.leave_carry_forward_id_seq'::regclass);


--
-- TOC entry 5398 (class 2604 OID 16708)
-- Name: leave_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies ALTER COLUMN id SET DEFAULT nextval('public.leave_policies_id_seq'::regclass);


--
-- TOC entry 5671 (class 2604 OID 18498)
-- Name: leave_policy_acknowledgments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policy_acknowledgments ALTER COLUMN id SET DEFAULT nextval('public.leave_policy_acknowledgments_id_seq'::regclass);


--
-- TOC entry 5406 (class 2604 OID 16737)
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- TOC entry 5538 (class 2604 OID 17540)
-- Name: leave_supporting_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_supporting_documents ALTER COLUMN id SET DEFAULT nextval('public.leave_supporting_documents_id_seq'::regclass);


--
-- TOC entry 5391 (class 2604 OID 16683)
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- TOC entry 5523 (class 2604 OID 17481)
-- Name: login_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history ALTER COLUMN id SET DEFAULT nextval('public.login_history_id_seq'::regclass);


--
-- TOC entry 5546 (class 2604 OID 17595)
-- Name: notification_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings ALTER COLUMN id SET DEFAULT nextval('public.notification_settings_id_seq'::regclass);


--
-- TOC entry 5516 (class 2604 OID 17423)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 5489 (class 2604 OID 17218)
-- Name: offboarding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding ALTER COLUMN id SET DEFAULT nextval('public.offboarding_id_seq'::regclass);


--
-- TOC entry 5469 (class 2604 OID 17077)
-- Name: onboarding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding ALTER COLUMN id SET DEFAULT nextval('public.onboarding_id_seq'::regclass);


--
-- TOC entry 5473 (class 2604 OID 17108)
-- Name: onboarding_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_tasks ALTER COLUMN id SET DEFAULT nextval('public.onboarding_tasks_id_seq'::regclass);


--
-- TOC entry 5664 (class 2604 OID 18461)
-- Name: password_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_history ALTER COLUMN id SET DEFAULT nextval('public.password_history_id_seq'::regclass);


--
-- TOC entry 5519 (class 2604 OID 17443)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 5433 (class 2604 OID 16899)
-- Name: payroll id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll ALTER COLUMN id SET DEFAULT nextval('public.payroll_id_seq'::regclass);


--
-- TOC entry 5447 (class 2604 OID 16941)
-- Name: payroll_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_items ALTER COLUMN id SET DEFAULT nextval('public.payroll_items_id_seq'::regclass);


--
-- TOC entry 5638 (class 2604 OID 18252)
-- Name: payroll_tax_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_tax_details ALTER COLUMN id SET DEFAULT nextval('public.payroll_tax_details_id_seq'::regclass);


--
-- TOC entry 5600 (class 2604 OID 17931)
-- Name: payslips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips ALTER COLUMN id SET DEFAULT nextval('public.payslips_id_seq'::regclass);


--
-- TOC entry 5494 (class 2604 OID 17261)
-- Name: performance_cycles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_cycles ALTER COLUMN id SET DEFAULT nextval('public.performance_cycles_id_seq'::regclass);


--
-- TOC entry 5507 (class 2604 OID 17357)
-- Name: performance_feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_feedback ALTER COLUMN id SET DEFAULT nextval('public.performance_feedback_id_seq'::regclass);


--
-- TOC entry 5682 (class 2604 OID 18606)
-- Name: performance_goal_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_history ALTER COLUMN id SET DEFAULT nextval('public.performance_goal_history_id_seq'::regclass);


--
-- TOC entry 5684 (class 2604 OID 18635)
-- Name: performance_goal_kpis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_kpis ALTER COLUMN id SET DEFAULT nextval('public.performance_goal_kpis_id_seq'::regclass);


--
-- TOC entry 5498 (class 2604 OID 17289)
-- Name: performance_goals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goals ALTER COLUMN id SET DEFAULT nextval('public.performance_goals_id_seq'::regclass);


--
-- TOC entry 5630 (class 2604 OID 18174)
-- Name: performance_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_history ALTER COLUMN id SET DEFAULT nextval('public.performance_history_id_seq'::regclass);


--
-- TOC entry 5503 (class 2604 OID 17324)
-- Name: performance_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews ALTER COLUMN id SET DEFAULT nextval('public.performance_reviews_id_seq'::regclass);


--
-- TOC entry 5569 (class 2604 OID 17668)
-- Name: permission_configuration id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_configuration ALTER COLUMN id SET DEFAULT nextval('public.permission_configuration_id_seq'::regclass);


--
-- TOC entry 5352 (class 2604 OID 16407)
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- TOC entry 5662 (class 2604 OID 18443)
-- Name: regional_holidays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regional_holidays ALTER COLUMN id SET DEFAULT nextval('public.regional_holidays_id_seq'::regclass);


--
-- TOC entry 5660 (class 2604 OID 18423)
-- Name: report_exports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_exports ALTER COLUMN id SET DEFAULT nextval('public.report_exports_id_seq'::regclass);


--
-- TOC entry 5477 (class 2604 OID 17133)
-- Name: resignations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resignations ALTER COLUMN id SET DEFAULT nextval('public.resignations_id_seq'::regclass);


--
-- TOC entry 5557 (class 2604 OID 17641)
-- Name: role_configuration id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_configuration ALTER COLUMN id SET DEFAULT nextval('public.role_configuration_id_seq'::regclass);


--
-- TOC entry 5350 (class 2604 OID 16393)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 5425 (class 2604 OID 16848)
-- Name: salary_components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_components ALTER COLUMN id SET DEFAULT nextval('public.salary_components_id_seq'::regclass);


--
-- TOC entry 5431 (class 2604 OID 16874)
-- Name: salary_revisions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_revisions ALTER COLUMN id SET DEFAULT nextval('public.salary_revisions_id_seq'::regclass);


--
-- TOC entry 5418 (class 2604 OID 16822)
-- Name: salary_structures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structures ALTER COLUMN id SET DEFAULT nextval('public.salary_structures_id_seq'::regclass);


--
-- TOC entry 5376 (class 2604 OID 16627)
-- Name: shifts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts ALTER COLUMN id SET DEFAULT nextval('public.shifts_id_seq'::regclass);


--
-- TOC entry 5658 (class 2604 OID 18406)
-- Name: system_activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_activity_logs ALTER COLUMN id SET DEFAULT nextval('public.system_activity_logs_id_seq'::regclass);


--
-- TOC entry 5543 (class 2604 OID 17580)
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings ALTER COLUMN id SET DEFAULT nextval('public.system_settings_id_seq'::regclass);


--
-- TOC entry 5368 (class 2604 OID 16527)
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- TOC entry 5354 (class 2604 OID 16438)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5415 (class 2604 OID 16797)
-- Name: weekly_offs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_offs ALTER COLUMN id SET DEFAULT nextval('public.weekly_offs_id_seq'::regclass);


--
-- TOC entry 6567 (class 0 OID 18201)
-- Dependencies: 355
-- Data for Name: announcement_recipients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcement_recipients (id, announcement_id, user_id, is_read, read_at, created_at) FROM stdin;
\.


--
-- TOC entry 6503 (class 0 OID 17385)
-- Dependencies: 291
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, company_id, title, content, announcement_type, department_id, published_by, publish_date, expiry_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6563 (class 0 OID 18143)
-- Dependencies: 351
-- Data for Name: approval_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_actions (id, approval_request_id, step_number, approver_id, action, comments, action_date) FROM stdin;
\.


--
-- TOC entry 6561 (class 0 OID 18117)
-- Dependencies: 349
-- Data for Name: approval_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_requests (id, workflow_id, requester_id, entity_type, entity_id, current_step, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6559 (class 0 OID 18092)
-- Dependencies: 347
-- Data for Name: approval_workflow_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_workflow_steps (id, workflow_id, step_number, approver_role_id, is_required, created_at) FROM stdin;
\.


--
-- TOC entry 6557 (class 0 OID 18063)
-- Dependencies: 345
-- Data for Name: approval_workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_workflows (id, company_id, workflow_name, workflow_type, first_approver_role_id, second_approver_role_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6539 (class 0 OID 17832)
-- Dependencies: 327
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, company_id, asset_code, asset_name, asset_type, serial_number, purchase_date, purchase_cost, status, assigned_to, assigned_date, returned_date, condition_on_assignment, condition_on_return, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6455 (class 0 OID 16647)
-- Dependencies: 243
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, employee_id, shift_id, attendance_date, check_in, check_out, working_hours, overtime_hours, status, late_minutes, early_checkout_minutes, correction_requested, correction_reason, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6597 (class 0 OID 18547)
-- Dependencies: 385
-- Data for Name: attendance_calendar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_calendar (id, company_id, attendance_date, is_working_day, holiday_id, weekly_off, created_at) FROM stdin;
\.


--
-- TOC entry 6541 (class 0 OID 17861)
-- Dependencies: 329
-- Data for Name: attendance_corrections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_corrections (id, attendance_id, employee_id, requested_check_in, requested_check_out, reason, status, approved_by, approved_at, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6515 (class 0 OID 17513)
-- Dependencies: 303
-- Data for Name: attendance_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_rules (id, company_id, rule_name, late_grace_minutes, early_checkout_grace_minutes, half_day_hours, full_day_hours, overtime_enabled, overtime_threshold_hours, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6595 (class 0 OID 18518)
-- Dependencies: 383
-- Data for Name: attendance_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_status_history (id, attendance_id, employee_id, old_status, new_status, changed_by, reason, created_at) FROM stdin;
\.


--
-- TOC entry 6513 (class 0 OID 17496)
-- Dependencies: 301
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- TOC entry 6445 (class 0 OID 16506)
-- Dependencies: 233
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, company_id, name, address, city, state, country, created_at) FROM stdin;
\.


--
-- TOC entry 6439 (class 0 OID 16459)
-- Dependencies: 227
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, email, phone, address, website, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6569 (class 0 OID 18225)
-- Dependencies: 357
-- Data for Name: company_event_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_event_participants (id, event_id, employee_id, attendance_status, registered_at) FROM stdin;
\.


--
-- TOC entry 6535 (class 0 OID 17779)
-- Dependencies: 323
-- Data for Name: company_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_events (id, company_id, title, description, event_date, start_time, end_time, location, created_by, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6519 (class 0 OID 17556)
-- Dependencies: 307
-- Data for Name: company_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_settings (id, company_id, setting_name, setting_value, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6551 (class 0 OID 18001)
-- Dependencies: 339
-- Data for Name: department_holidays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department_holidays (id, department_id, holiday_id, created_at) FROM stdin;
\.


--
-- TOC entry 6441 (class 0 OID 16472)
-- Dependencies: 229
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, company_id, name, description, created_at) FROM stdin;
\.


--
-- TOC entry 6443 (class 0 OID 16492)
-- Dependencies: 231
-- Data for Name: designations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.designations (id, name, description, created_at) FROM stdin;
\.


--
-- TOC entry 6579 (class 0 OID 18356)
-- Dependencies: 367
-- Data for Name: document_activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_activity_logs (id, document_id, user_id, action, action_details, created_at) FROM stdin;
\.


--
-- TOC entry 6481 (class 0 OID 17019)
-- Dependencies: 269
-- Data for Name: document_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_categories (id, company_id, name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6525 (class 0 OID 17613)
-- Dependencies: 313
-- Data for Name: document_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_settings (id, company_id, document_category_id, max_file_size_mb, allowed_file_types, verification_required, expiry_tracking_enabled, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6483 (class 0 OID 17041)
-- Dependencies: 271
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, employee_id, category_id, document_name, file_url, document_number, issue_date, expiry_date, verification_status, verified_by, verified_at, rejection_reason, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6509 (class 0 OID 17459)
-- Dependencies: 297
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_verification_tokens (id, user_id, token, expires_at, verified_at, created_at) FROM stdin;
\.


--
-- TOC entry 6573 (class 0 OID 18277)
-- Dependencies: 361
-- Data for Name: employee_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_assets (id, employee_id, asset_id, assigned_date, returned_date, assignment_status, condition_on_assignment, condition_on_return, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6629 (class 0 OID 18976)
-- Dependencies: 417
-- Data for Name: employee_bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_bank_accounts (id, employee_id, account_holder_name, bank_name, account_number, ifsc_code, account_type, is_primary, is_verified, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6553 (class 0 OID 18024)
-- Dependencies: 341
-- Data for Name: employee_birthdays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_birthdays (id, employee_id, birth_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6621 (class 0 OID 18852)
-- Dependencies: 409
-- Data for Name: employee_documents_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_documents_access (id, document_id, user_id, can_view, can_download, granted_by, granted_at) FROM stdin;
\.


--
-- TOC entry 6547 (class 0 OID 17956)
-- Dependencies: 335
-- Data for Name: employee_emergency_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_emergency_contacts (id, employee_id, contact_name, relationship, phone, alternate_phone, email, address, is_primary, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6613 (class 0 OID 18749)
-- Dependencies: 401
-- Data for Name: employee_employment_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_employment_history (id, employee_id, employment_type_id, designation_id, department_id, branch_id, start_date, end_date, status, reason, created_at) FROM stdin;
\.


--
-- TOC entry 6625 (class 0 OID 18905)
-- Dependencies: 413
-- Data for Name: employee_exit_interviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_exit_interviews (id, employee_id, resignation_id, interview_date, conducted_by, reason_for_leaving, feedback, suggestions, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6451 (class 0 OID 16600)
-- Dependencies: 239
-- Data for Name: employee_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_history (id, employee_id, change_type, old_value, new_value, effective_date, remarks, changed_by, created_at) FROM stdin;
\.


--
-- TOC entry 6617 (class 0 OID 18815)
-- Dependencies: 405
-- Data for Name: employee_invitation_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_invitation_tasks (id, invitation_id, task_name, task_description, status, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6615 (class 0 OID 18788)
-- Dependencies: 403
-- Data for Name: employee_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_invitations (id, company_id, email, employee_code, invited_by, invitation_token, expires_at, status, accepted_at, created_at) FROM stdin;
\.


--
-- TOC entry 6591 (class 0 OID 18475)
-- Dependencies: 379
-- Data for Name: employee_login_security; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_login_security (id, user_id, failed_login_attempts, account_locked, locked_until, last_successful_login, last_failed_login, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6605 (class 0 OID 18653)
-- Dependencies: 393
-- Data for Name: employee_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_notes (id, employee_id, created_by, note, is_private, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6581 (class 0 OID 18380)
-- Dependencies: 369
-- Data for Name: employee_policy_acknowledgments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_policy_acknowledgments (id, employee_id, policy_id, acknowledged_at) FROM stdin;
\.


--
-- TOC entry 6623 (class 0 OID 18882)
-- Dependencies: 411
-- Data for Name: employee_profile_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_profile_history (id, employee_id, field_name, old_value, new_value, changed_by, changed_at) FROM stdin;
\.


--
-- TOC entry 6607 (class 0 OID 18679)
-- Dependencies: 395
-- Data for Name: employee_reporting_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_reporting_history (id, employee_id, manager_id, start_date, end_date, reason, created_at) FROM stdin;
\.


--
-- TOC entry 6619 (class 0 OID 18835)
-- Dependencies: 407
-- Data for Name: employee_search_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_search_history (id, user_id, search_query, filters, searched_at) FROM stdin;
\.


--
-- TOC entry 6549 (class 0 OID 17977)
-- Dependencies: 337
-- Data for Name: employee_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_status_history (id, employee_id, old_status, new_status, effective_date, reason, changed_by, created_at) FROM stdin;
\.


--
-- TOC entry 6531 (class 0 OID 17690)
-- Dependencies: 319
-- Data for Name: employee_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_transfers (id, employee_id, from_department_id, to_department_id, from_designation_id, to_designation_id, from_branch_id, to_branch_id, from_team_id, to_team_id, transfer_date, reason, approved_by, created_at) FROM stdin;
\.


--
-- TOC entry 6555 (class 0 OID 18043)
-- Dependencies: 343
-- Data for Name: employee_work_anniversaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_work_anniversaries (id, employee_id, joining_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6609 (class 0 OID 18703)
-- Dependencies: 397
-- Data for Name: employee_work_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_work_locations (id, employee_id, branch_id, start_date, end_date, is_primary, created_at) FROM stdin;
\.


--
-- TOC entry 6449 (class 0 OID 16543)
-- Dependencies: 237
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, user_id, company_id, employee_code, first_name, last_name, date_of_birth, gender, phone, email, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, department_id, designation_id, branch_id, team_id, reporting_manager_id, employment_type, joining_date, employment_status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6611 (class 0 OID 18727)
-- Dependencies: 399
-- Data for Name: employment_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employment_types (id, company_id, name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6491 (class 0 OID 17187)
-- Dependencies: 279
-- Data for Name: exit_clearance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exit_clearance (id, resignation_id, department_clearance, asset_returned, finance_clearance, hr_clearance, clearance_status, cleared_by, cleared_at, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6577 (class 0 OID 18331)
-- Dependencies: 365
-- Data for Name: expense_approval_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_approval_history (id, expense_id, approver_id, action, comments, action_date) FROM stdin;
\.


--
-- TOC entry 6477 (class 0 OID 16960)
-- Dependencies: 265
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, company_id, name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6479 (class 0 OID 16982)
-- Dependencies: 267
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, employee_id, category_id, expense_date, amount, description, receipt_url, status, approved_by, approved_at, rejection_reason, reimbursement_status, reimbursed_amount, reimbursed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6627 (class 0 OID 18936)
-- Dependencies: 415
-- Data for Name: final_settlements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.final_settlements (id, employee_id, resignation_id, salary_due, leave_encashment, bonus_due, deductions, total_settlement, settlement_date, status, processed_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6463 (class 0 OID 16770)
-- Dependencies: 251
-- Data for Name: holidays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.holidays (id, company_id, name, holiday_date, holiday_type, description, is_optional, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6537 (class 0 OID 17806)
-- Dependencies: 325
-- Data for Name: hr_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_messages (id, sender_id, recipient_id, subject, message, is_read, read_at, created_at) FROM stdin;
\.


--
-- TOC entry 6533 (class 0 OID 17753)
-- Dependencies: 321
-- Data for Name: hr_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_policies (id, company_id, title, description, policy_type, effective_from, effective_to, document_url, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6575 (class 0 OID 18306)
-- Dependencies: 363
-- Data for Name: leave_approval_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_approval_history (id, leave_request_id, approver_id, action, comments, action_date) FROM stdin;
\.


--
-- TOC entry 6599 (class 0 OID 18573)
-- Dependencies: 387
-- Data for Name: leave_calendar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_calendar (id, company_id, employee_id, leave_request_id, calendar_date, leave_status, created_at) FROM stdin;
\.


--
-- TOC entry 6543 (class 0 OID 17892)
-- Dependencies: 331
-- Data for Name: leave_carry_forward; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_carry_forward (id, employee_id, leave_type_id, from_year, to_year, carried_forward_days, used_days, remaining_days, expiry_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6459 (class 0 OID 16705)
-- Dependencies: 247
-- Data for Name: leave_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_policies (id, company_id, leave_type_id, annual_allocation, monthly_accrual, requires_approval, allow_negative_balance, effective_from, effective_to, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6593 (class 0 OID 18495)
-- Dependencies: 381
-- Data for Name: leave_policy_acknowledgments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_policy_acknowledgments (id, employee_id, leave_policy_id, acknowledged_at) FROM stdin;
\.


--
-- TOC entry 6461 (class 0 OID 16734)
-- Dependencies: 249
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by, approved_at, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6517 (class 0 OID 17537)
-- Dependencies: 305
-- Data for Name: leave_supporting_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_supporting_documents (id, leave_request_id, document_name, file_url, uploaded_at) FROM stdin;
\.


--
-- TOC entry 6457 (class 0 OID 16680)
-- Dependencies: 245
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, company_id, name, description, is_paid, max_days_per_year, carry_forward_allowed, max_carry_forward_days, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6511 (class 0 OID 17478)
-- Dependencies: 299
-- Data for Name: login_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_history (id, user_id, login_time, logout_time, ip_address, user_agent, login_status) FROM stdin;
\.


--
-- TOC entry 6523 (class 0 OID 17592)
-- Dependencies: 311
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_settings (id, company_id, notification_type, email_enabled, in_app_enabled, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6505 (class 0 OID 17420)
-- Dependencies: 293
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, notification_type, is_read, read_at, created_at) FROM stdin;
\.


--
-- TOC entry 6493 (class 0 OID 17215)
-- Dependencies: 281
-- Data for Name: offboarding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offboarding (id, employee_id, resignation_id, clearance_id, exit_interview_date, exit_interview_notes, final_settlement_amount, final_settlement_date, experience_letter_url, relieving_letter_url, status, completed_by, completed_at, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6485 (class 0 OID 17074)
-- Dependencies: 273
-- Data for Name: onboarding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.onboarding (id, employee_id, start_date, expected_completion_date, actual_completion_date, status, assigned_hr, assigned_manager, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6487 (class 0 OID 17105)
-- Dependencies: 275
-- Data for Name: onboarding_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.onboarding_tasks (id, onboarding_id, task_name, description, assigned_to, due_date, completed_at, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6589 (class 0 OID 18458)
-- Dependencies: 377
-- Data for Name: password_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_history (id, user_id, password_hash, changed_at) FROM stdin;
\.


--
-- TOC entry 6507 (class 0 OID 17440)
-- Dependencies: 295
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, used_at, created_at) FROM stdin;
\.


--
-- TOC entry 6473 (class 0 OID 16896)
-- Dependencies: 261
-- Data for Name: payroll; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll (id, employee_id, payroll_month, payroll_year, basic_salary, total_earnings, total_deductions, overtime_amount, bonus_amount, gross_salary, net_salary, working_days, paid_days, unpaid_days, status, processed_by, processed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6475 (class 0 OID 16938)
-- Dependencies: 263
-- Data for Name: payroll_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_items (id, payroll_id, component_name, component_type, amount, created_at) FROM stdin;
\.


--
-- TOC entry 6571 (class 0 OID 18249)
-- Dependencies: 359
-- Data for Name: payroll_tax_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_tax_details (id, payroll_id, taxable_income, tax_amount, provident_fund, professional_tax, other_statutory_deductions, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6545 (class 0 OID 17928)
-- Dependencies: 333
-- Data for Name: payslips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payslips (id, payroll_id, employee_id, payslip_number, payslip_url, generated_at) FROM stdin;
\.


--
-- TOC entry 6495 (class 0 OID 17258)
-- Dependencies: 283
-- Data for Name: performance_cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_cycles (id, company_id, name, description, start_date, end_date, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6501 (class 0 OID 17354)
-- Dependencies: 289
-- Data for Name: performance_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_feedback (id, employee_id, cycle_id, reviewer_id, feedback, rating, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6601 (class 0 OID 18603)
-- Dependencies: 389
-- Data for Name: performance_goal_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_goal_history (id, goal_id, employee_id, old_status, new_status, old_achieved_value, new_achieved_value, changed_by, change_reason, created_at) FROM stdin;
\.


--
-- TOC entry 6603 (class 0 OID 18632)
-- Dependencies: 391
-- Data for Name: performance_goal_kpis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_goal_kpis (id, goal_id, kpi_name, description, target_value, measurement_unit, weight_percentage, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6497 (class 0 OID 17286)
-- Dependencies: 285
-- Data for Name: performance_goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_goals (id, employee_id, cycle_id, title, description, kpi_name, target_value, achieved_value, weight_percentage, status, start_date, due_date, completed_at, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6565 (class 0 OID 18171)
-- Dependencies: 353
-- Data for Name: performance_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_history (id, employee_id, cycle_id, review_id, final_rating, performance_level, final_comments, recorded_date, created_at) FROM stdin;
\.


--
-- TOC entry 6499 (class 0 OID 17321)
-- Dependencies: 287
-- Data for Name: performance_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_reviews (id, employee_id, cycle_id, reviewer_id, review_type, overall_rating, strengths, areas_for_improvement, employee_comments, manager_comments, status, submitted_at, reviewed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6529 (class 0 OID 17665)
-- Dependencies: 317
-- Data for Name: permission_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_configuration (id, role_id, permission_id, is_allowed, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6434 (class 0 OID 16404)
-- Dependencies: 222
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description, created_at) FROM stdin;
\.


--
-- TOC entry 6587 (class 0 OID 18440)
-- Dependencies: 375
-- Data for Name: regional_holidays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regional_holidays (id, holiday_id, region, created_at) FROM stdin;
\.


--
-- TOC entry 6585 (class 0 OID 18420)
-- Dependencies: 373
-- Data for Name: report_exports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_exports (id, user_id, report_type, file_format, file_url, generated_at) FROM stdin;
\.


--
-- TOC entry 6489 (class 0 OID 17130)
-- Dependencies: 277
-- Data for Name: resignations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resignations (id, employee_id, resignation_date, last_working_date, reason, status, approved_by, approved_at, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6527 (class 0 OID 17638)
-- Dependencies: 315
-- Data for Name: role_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_configuration (id, role_id, can_manage_users, can_manage_employees, can_manage_attendance, can_manage_leave, can_manage_payroll, can_manage_expenses, can_manage_documents, can_manage_performance, can_view_reports, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6435 (class 0 OID 16417)
-- Dependencies: 223
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
\.


--
-- TOC entry 6432 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at) FROM stdin;
\.


--
-- TOC entry 6469 (class 0 OID 16845)
-- Dependencies: 257
-- Data for Name: salary_components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_components (id, salary_structure_id, component_name, component_type, calculation_type, amount, percentage, is_taxable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6471 (class 0 OID 16871)
-- Dependencies: 259
-- Data for Name: salary_revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_revisions (id, employee_id, previous_salary, new_salary, revision_date, reason, approved_by, created_at) FROM stdin;
\.


--
-- TOC entry 6467 (class 0 OID 16819)
-- Dependencies: 255
-- Data for Name: salary_structures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_structures (id, employee_id, effective_from, effective_to, basic_salary, gross_salary, currency, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6453 (class 0 OID 16624)
-- Dependencies: 241
-- Data for Name: shifts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shifts (id, company_id, name, start_time, end_time, grace_minutes, break_minutes, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6583 (class 0 OID 18403)
-- Dependencies: 371
-- Data for Name: system_activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_activity_logs (id, user_id, action, module, description, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- TOC entry 6521 (class 0 OID 17577)
-- Dependencies: 309
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (id, setting_name, setting_value, description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6447 (class 0 OID 16524)
-- Dependencies: 235
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, department_id, name, description, created_at) FROM stdin;
\.


--
-- TOC entry 6437 (class 0 OID 16435)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role_id, is_active, is_verified, last_login, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6465 (class 0 OID 16794)
-- Dependencies: 253
-- Data for Name: weekly_offs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_offs (id, company_id, day_of_week, branch_id, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 6734 (class 0 OID 0)
-- Dependencies: 354
-- Name: announcement_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcement_recipients_id_seq', 1, false);


--
-- TOC entry 6735 (class 0 OID 0)
-- Dependencies: 290
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcements_id_seq', 1, false);


--
-- TOC entry 6736 (class 0 OID 0)
-- Dependencies: 350
-- Name: approval_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_actions_id_seq', 1, false);


--
-- TOC entry 6737 (class 0 OID 0)
-- Dependencies: 348
-- Name: approval_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_requests_id_seq', 1, false);


--
-- TOC entry 6738 (class 0 OID 0)
-- Dependencies: 346
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_workflow_steps_id_seq', 1, false);


--
-- TOC entry 6739 (class 0 OID 0)
-- Dependencies: 344
-- Name: approval_workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_workflows_id_seq', 1, false);


--
-- TOC entry 6740 (class 0 OID 0)
-- Dependencies: 326
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 1, false);


--
-- TOC entry 6741 (class 0 OID 0)
-- Dependencies: 384
-- Name: attendance_calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_calendar_id_seq', 1, false);


--
-- TOC entry 6742 (class 0 OID 0)
-- Dependencies: 328
-- Name: attendance_corrections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_corrections_id_seq', 1, false);


--
-- TOC entry 6743 (class 0 OID 0)
-- Dependencies: 242
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- TOC entry 6744 (class 0 OID 0)
-- Dependencies: 302
-- Name: attendance_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_rules_id_seq', 1, false);


--
-- TOC entry 6745 (class 0 OID 0)
-- Dependencies: 382
-- Name: attendance_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_status_history_id_seq', 1, false);


--
-- TOC entry 6746 (class 0 OID 0)
-- Dependencies: 300
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- TOC entry 6747 (class 0 OID 0)
-- Dependencies: 232
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 1, false);


--
-- TOC entry 6748 (class 0 OID 0)
-- Dependencies: 226
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, false);


--
-- TOC entry 6749 (class 0 OID 0)
-- Dependencies: 356
-- Name: company_event_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_event_participants_id_seq', 1, false);


--
-- TOC entry 6750 (class 0 OID 0)
-- Dependencies: 322
-- Name: company_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_events_id_seq', 1, false);


--
-- TOC entry 6751 (class 0 OID 0)
-- Dependencies: 306
-- Name: company_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_settings_id_seq', 1, false);


--
-- TOC entry 6752 (class 0 OID 0)
-- Dependencies: 338
-- Name: department_holidays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_holidays_id_seq', 1, false);


--
-- TOC entry 6753 (class 0 OID 0)
-- Dependencies: 228
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, false);


--
-- TOC entry 6754 (class 0 OID 0)
-- Dependencies: 230
-- Name: designations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.designations_id_seq', 1, false);


--
-- TOC entry 6755 (class 0 OID 0)
-- Dependencies: 366
-- Name: document_activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_activity_logs_id_seq', 1, false);


--
-- TOC entry 6756 (class 0 OID 0)
-- Dependencies: 268
-- Name: document_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_categories_id_seq', 1, false);


--
-- TOC entry 6757 (class 0 OID 0)
-- Dependencies: 312
-- Name: document_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_settings_id_seq', 1, false);


--
-- TOC entry 6758 (class 0 OID 0)
-- Dependencies: 270
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- TOC entry 6759 (class 0 OID 0)
-- Dependencies: 296
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_verification_tokens_id_seq', 1, false);


--
-- TOC entry 6760 (class 0 OID 0)
-- Dependencies: 360
-- Name: employee_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_assets_id_seq', 1, false);


--
-- TOC entry 6761 (class 0 OID 0)
-- Dependencies: 416
-- Name: employee_bank_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_bank_accounts_id_seq', 1, false);


--
-- TOC entry 6762 (class 0 OID 0)
-- Dependencies: 340
-- Name: employee_birthdays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_birthdays_id_seq', 1, false);


--
-- TOC entry 6763 (class 0 OID 0)
-- Dependencies: 408
-- Name: employee_documents_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_documents_access_id_seq', 1, false);


--
-- TOC entry 6764 (class 0 OID 0)
-- Dependencies: 334
-- Name: employee_emergency_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_emergency_contacts_id_seq', 1, false);


--
-- TOC entry 6765 (class 0 OID 0)
-- Dependencies: 400
-- Name: employee_employment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_employment_history_id_seq', 1, false);


--
-- TOC entry 6766 (class 0 OID 0)
-- Dependencies: 412
-- Name: employee_exit_interviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_exit_interviews_id_seq', 1, false);


--
-- TOC entry 6767 (class 0 OID 0)
-- Dependencies: 238
-- Name: employee_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_history_id_seq', 1, false);


--
-- TOC entry 6768 (class 0 OID 0)
-- Dependencies: 404
-- Name: employee_invitation_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_invitation_tasks_id_seq', 1, false);


--
-- TOC entry 6769 (class 0 OID 0)
-- Dependencies: 402
-- Name: employee_invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_invitations_id_seq', 1, false);


--
-- TOC entry 6770 (class 0 OID 0)
-- Dependencies: 378
-- Name: employee_login_security_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_login_security_id_seq', 1, false);


--
-- TOC entry 6771 (class 0 OID 0)
-- Dependencies: 392
-- Name: employee_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_notes_id_seq', 1, false);


--
-- TOC entry 6772 (class 0 OID 0)
-- Dependencies: 368
-- Name: employee_policy_acknowledgments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_policy_acknowledgments_id_seq', 1, false);


--
-- TOC entry 6773 (class 0 OID 0)
-- Dependencies: 410
-- Name: employee_profile_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_profile_history_id_seq', 1, false);


--
-- TOC entry 6774 (class 0 OID 0)
-- Dependencies: 394
-- Name: employee_reporting_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_reporting_history_id_seq', 1, false);


--
-- TOC entry 6775 (class 0 OID 0)
-- Dependencies: 406
-- Name: employee_search_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_search_history_id_seq', 1, false);


--
-- TOC entry 6776 (class 0 OID 0)
-- Dependencies: 336
-- Name: employee_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_status_history_id_seq', 1, false);


--
-- TOC entry 6777 (class 0 OID 0)
-- Dependencies: 318
-- Name: employee_transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_transfers_id_seq', 1, false);


--
-- TOC entry 6778 (class 0 OID 0)
-- Dependencies: 342
-- Name: employee_work_anniversaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_work_anniversaries_id_seq', 1, false);


--
-- TOC entry 6779 (class 0 OID 0)
-- Dependencies: 396
-- Name: employee_work_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_work_locations_id_seq', 1, false);


--
-- TOC entry 6780 (class 0 OID 0)
-- Dependencies: 236
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- TOC entry 6781 (class 0 OID 0)
-- Dependencies: 398
-- Name: employment_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employment_types_id_seq', 1, false);


--
-- TOC entry 6782 (class 0 OID 0)
-- Dependencies: 278
-- Name: exit_clearance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exit_clearance_id_seq', 1, false);


--
-- TOC entry 6783 (class 0 OID 0)
-- Dependencies: 364
-- Name: expense_approval_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_approval_history_id_seq', 1, false);


--
-- TOC entry 6784 (class 0 OID 0)
-- Dependencies: 264
-- Name: expense_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_categories_id_seq', 1, false);


--
-- TOC entry 6785 (class 0 OID 0)
-- Dependencies: 266
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 1, false);


--
-- TOC entry 6786 (class 0 OID 0)
-- Dependencies: 414
-- Name: final_settlements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.final_settlements_id_seq', 1, false);


--
-- TOC entry 6787 (class 0 OID 0)
-- Dependencies: 250
-- Name: holidays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.holidays_id_seq', 1, false);


--
-- TOC entry 6788 (class 0 OID 0)
-- Dependencies: 324
-- Name: hr_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_messages_id_seq', 1, false);


--
-- TOC entry 6789 (class 0 OID 0)
-- Dependencies: 320
-- Name: hr_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_policies_id_seq', 1, false);


--
-- TOC entry 6790 (class 0 OID 0)
-- Dependencies: 362
-- Name: leave_approval_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_approval_history_id_seq', 1, false);


--
-- TOC entry 6791 (class 0 OID 0)
-- Dependencies: 386
-- Name: leave_calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_calendar_id_seq', 1, false);


--
-- TOC entry 6792 (class 0 OID 0)
-- Dependencies: 330
-- Name: leave_carry_forward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_carry_forward_id_seq', 1, false);


--
-- TOC entry 6793 (class 0 OID 0)
-- Dependencies: 246
-- Name: leave_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_policies_id_seq', 1, false);


--
-- TOC entry 6794 (class 0 OID 0)
-- Dependencies: 380
-- Name: leave_policy_acknowledgments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_policy_acknowledgments_id_seq', 1, false);


--
-- TOC entry 6795 (class 0 OID 0)
-- Dependencies: 248
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, false);


--
-- TOC entry 6796 (class 0 OID 0)
-- Dependencies: 304
-- Name: leave_supporting_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_supporting_documents_id_seq', 1, false);


--
-- TOC entry 6797 (class 0 OID 0)
-- Dependencies: 244
-- Name: leave_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_types_id_seq', 1, false);


--
-- TOC entry 6798 (class 0 OID 0)
-- Dependencies: 298
-- Name: login_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_history_id_seq', 1, false);


--
-- TOC entry 6799 (class 0 OID 0)
-- Dependencies: 310
-- Name: notification_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_settings_id_seq', 1, false);


--
-- TOC entry 6800 (class 0 OID 0)
-- Dependencies: 292
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 6801 (class 0 OID 0)
-- Dependencies: 280
-- Name: offboarding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offboarding_id_seq', 1, false);


--
-- TOC entry 6802 (class 0 OID 0)
-- Dependencies: 272
-- Name: onboarding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.onboarding_id_seq', 1, false);


--
-- TOC entry 6803 (class 0 OID 0)
-- Dependencies: 274
-- Name: onboarding_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.onboarding_tasks_id_seq', 1, false);


--
-- TOC entry 6804 (class 0 OID 0)
-- Dependencies: 376
-- Name: password_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_history_id_seq', 1, false);


--
-- TOC entry 6805 (class 0 OID 0)
-- Dependencies: 294
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- TOC entry 6806 (class 0 OID 0)
-- Dependencies: 260
-- Name: payroll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payroll_id_seq', 1, false);


--
-- TOC entry 6807 (class 0 OID 0)
-- Dependencies: 262
-- Name: payroll_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payroll_items_id_seq', 1, false);


--
-- TOC entry 6808 (class 0 OID 0)
-- Dependencies: 358
-- Name: payroll_tax_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payroll_tax_details_id_seq', 1, false);


--
-- TOC entry 6809 (class 0 OID 0)
-- Dependencies: 332
-- Name: payslips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payslips_id_seq', 1, false);


--
-- TOC entry 6810 (class 0 OID 0)
-- Dependencies: 282
-- Name: performance_cycles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_cycles_id_seq', 1, false);


--
-- TOC entry 6811 (class 0 OID 0)
-- Dependencies: 288
-- Name: performance_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_feedback_id_seq', 1, false);


--
-- TOC entry 6812 (class 0 OID 0)
-- Dependencies: 388
-- Name: performance_goal_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_goal_history_id_seq', 1, false);


--
-- TOC entry 6813 (class 0 OID 0)
-- Dependencies: 390
-- Name: performance_goal_kpis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_goal_kpis_id_seq', 1, false);


--
-- TOC entry 6814 (class 0 OID 0)
-- Dependencies: 284
-- Name: performance_goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_goals_id_seq', 1, false);


--
-- TOC entry 6815 (class 0 OID 0)
-- Dependencies: 352
-- Name: performance_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_history_id_seq', 1, false);


--
-- TOC entry 6816 (class 0 OID 0)
-- Dependencies: 286
-- Name: performance_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.performance_reviews_id_seq', 1, false);


--
-- TOC entry 6817 (class 0 OID 0)
-- Dependencies: 316
-- Name: permission_configuration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_configuration_id_seq', 1, false);


--
-- TOC entry 6818 (class 0 OID 0)
-- Dependencies: 221
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- TOC entry 6819 (class 0 OID 0)
-- Dependencies: 374
-- Name: regional_holidays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regional_holidays_id_seq', 1, false);


--
-- TOC entry 6820 (class 0 OID 0)
-- Dependencies: 372
-- Name: report_exports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.report_exports_id_seq', 1, false);


--
-- TOC entry 6821 (class 0 OID 0)
-- Dependencies: 276
-- Name: resignations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resignations_id_seq', 1, false);


--
-- TOC entry 6822 (class 0 OID 0)
-- Dependencies: 314
-- Name: role_configuration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_configuration_id_seq', 1, false);


--
-- TOC entry 6823 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 6824 (class 0 OID 0)
-- Dependencies: 256
-- Name: salary_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salary_components_id_seq', 1, false);


--
-- TOC entry 6825 (class 0 OID 0)
-- Dependencies: 258
-- Name: salary_revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salary_revisions_id_seq', 1, false);


--
-- TOC entry 6826 (class 0 OID 0)
-- Dependencies: 254
-- Name: salary_structures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salary_structures_id_seq', 1, false);


--
-- TOC entry 6827 (class 0 OID 0)
-- Dependencies: 240
-- Name: shifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shifts_id_seq', 1, false);


--
-- TOC entry 6828 (class 0 OID 0)
-- Dependencies: 370
-- Name: system_activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_activity_logs_id_seq', 1, false);


--
-- TOC entry 6829 (class 0 OID 0)
-- Dependencies: 308
-- Name: system_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_settings_id_seq', 1, false);


--
-- TOC entry 6830 (class 0 OID 0)
-- Dependencies: 234
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 1, false);


--
-- TOC entry 6831 (class 0 OID 0)
-- Dependencies: 224
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 6832 (class 0 OID 0)
-- Dependencies: 252
-- Name: weekly_offs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.weekly_offs_id_seq', 1, false);


--
-- TOC entry 6002 (class 2606 OID 18213)
-- Name: announcement_recipients announcement_recipients_announcement_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_announcement_id_user_id_key UNIQUE (announcement_id, user_id);


--
-- TOC entry 6004 (class 2606 OID 18211)
-- Name: announcement_recipients announcement_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_pkey PRIMARY KEY (id);


--
-- TOC entry 5906 (class 2606 OID 17403)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- TOC entry 5996 (class 2606 OID 18159)
-- Name: approval_actions approval_actions_approval_request_id_step_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_actions
    ADD CONSTRAINT approval_actions_approval_request_id_step_number_key UNIQUE (approval_request_id, step_number);


--
-- TOC entry 5998 (class 2606 OID 18157)
-- Name: approval_actions approval_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_actions
    ADD CONSTRAINT approval_actions_pkey PRIMARY KEY (id);


--
-- TOC entry 5994 (class 2606 OID 18131)
-- Name: approval_requests approval_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT approval_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5990 (class 2606 OID 18103)
-- Name: approval_workflow_steps approval_workflow_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_pkey PRIMARY KEY (id);


--
-- TOC entry 5992 (class 2606 OID 18105)
-- Name: approval_workflow_steps approval_workflow_steps_workflow_id_step_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_workflow_id_step_number_key UNIQUE (workflow_id, step_number);


--
-- TOC entry 5988 (class 2606 OID 18075)
-- Name: approval_workflows approval_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_pkey PRIMARY KEY (id);


--
-- TOC entry 5956 (class 2606 OID 17849)
-- Name: assets assets_asset_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_code_key UNIQUE (asset_code);


--
-- TOC entry 5958 (class 2606 OID 17847)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- TOC entry 6048 (class 2606 OID 18560)
-- Name: attendance_calendar attendance_calendar_company_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_calendar
    ADD CONSTRAINT attendance_calendar_company_id_attendance_date_key UNIQUE (company_id, attendance_date);


--
-- TOC entry 6050 (class 2606 OID 18558)
-- Name: attendance_calendar attendance_calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_calendar
    ADD CONSTRAINT attendance_calendar_pkey PRIMARY KEY (id);


--
-- TOC entry 5960 (class 2606 OID 17875)
-- Name: attendance_corrections attendance_corrections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_corrections
    ADD CONSTRAINT attendance_corrections_pkey PRIMARY KEY (id);


--
-- TOC entry 5836 (class 2606 OID 16668)
-- Name: attendance attendance_employee_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_employee_id_attendance_date_key UNIQUE (employee_id, attendance_date);


--
-- TOC entry 5838 (class 2606 OID 16666)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- TOC entry 5922 (class 2606 OID 17530)
-- Name: attendance_rules attendance_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_rules
    ADD CONSTRAINT attendance_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 6046 (class 2606 OID 18530)
-- Name: attendance_status_history attendance_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_status_history
    ADD CONSTRAINT attendance_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5920 (class 2606 OID 17506)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5818 (class 2606 OID 16517)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- TOC entry 5808 (class 2606 OID 16470)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 6006 (class 2606 OID 18237)
-- Name: company_event_participants company_event_participants_event_id_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_event_participants
    ADD CONSTRAINT company_event_participants_event_id_employee_id_key UNIQUE (event_id, employee_id);


--
-- TOC entry 6008 (class 2606 OID 18235)
-- Name: company_event_participants company_event_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_event_participants
    ADD CONSTRAINT company_event_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 5952 (class 2606 OID 17794)
-- Name: company_events company_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_events
    ADD CONSTRAINT company_events_pkey PRIMARY KEY (id);


--
-- TOC entry 5926 (class 2606 OID 17570)
-- Name: company_settings company_settings_company_id_setting_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_company_id_setting_name_key UNIQUE (company_id, setting_name);


--
-- TOC entry 5928 (class 2606 OID 17568)
-- Name: company_settings company_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5976 (class 2606 OID 18012)
-- Name: department_holidays department_holidays_department_id_holiday_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_holidays
    ADD CONSTRAINT department_holidays_department_id_holiday_id_key UNIQUE (department_id, holiday_id);


--
-- TOC entry 5978 (class 2606 OID 18010)
-- Name: department_holidays department_holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_holidays
    ADD CONSTRAINT department_holidays_pkey PRIMARY KEY (id);


--
-- TOC entry 5810 (class 2606 OID 16485)
-- Name: departments departments_company_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_company_id_name_key UNIQUE (company_id, name);


--
-- TOC entry 5812 (class 2606 OID 16483)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5814 (class 2606 OID 16504)
-- Name: designations designations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_name_key UNIQUE (name);


--
-- TOC entry 5816 (class 2606 OID 16502)
-- Name: designations designations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_pkey PRIMARY KEY (id);


--
-- TOC entry 6022 (class 2606 OID 18368)
-- Name: document_activity_logs document_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_activity_logs
    ADD CONSTRAINT document_activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5876 (class 2606 OID 17034)
-- Name: document_categories document_categories_company_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_company_id_name_key UNIQUE (company_id, name);


--
-- TOC entry 5878 (class 2606 OID 17032)
-- Name: document_categories document_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5938 (class 2606 OID 17625)
-- Name: document_settings document_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_settings
    ADD CONSTRAINT document_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5880 (class 2606 OID 17057)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5914 (class 2606 OID 17469)
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 5916 (class 2606 OID 17471)
-- Name: email_verification_tokens email_verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_key UNIQUE (token);


--
-- TOC entry 6014 (class 2606 OID 18294)
-- Name: employee_assets employee_assets_employee_id_asset_id_assigned_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assets
    ADD CONSTRAINT employee_assets_employee_id_asset_id_assigned_date_key UNIQUE (employee_id, asset_id, assigned_date);


--
-- TOC entry 6016 (class 2606 OID 18292)
-- Name: employee_assets employee_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assets
    ADD CONSTRAINT employee_assets_pkey PRIMARY KEY (id);


--
-- TOC entry 6094 (class 2606 OID 18992)
-- Name: employee_bank_accounts employee_bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_accounts
    ADD CONSTRAINT employee_bank_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5980 (class 2606 OID 18036)
-- Name: employee_birthdays employee_birthdays_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_birthdays
    ADD CONSTRAINT employee_birthdays_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5982 (class 2606 OID 18034)
-- Name: employee_birthdays employee_birthdays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_birthdays
    ADD CONSTRAINT employee_birthdays_pkey PRIMARY KEY (id);


--
-- TOC entry 6080 (class 2606 OID 18865)
-- Name: employee_documents_access employee_documents_access_document_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access
    ADD CONSTRAINT employee_documents_access_document_id_user_id_key UNIQUE (document_id, user_id);


--
-- TOC entry 6082 (class 2606 OID 18863)
-- Name: employee_documents_access employee_documents_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access
    ADD CONSTRAINT employee_documents_access_pkey PRIMARY KEY (id);


--
-- TOC entry 5972 (class 2606 OID 17970)
-- Name: employee_emergency_contacts employee_emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_emergency_contacts
    ADD CONSTRAINT employee_emergency_contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 6070 (class 2606 OID 18761)
-- Name: employee_employment_history employee_employment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6086 (class 2606 OID 18917)
-- Name: employee_exit_interviews employee_exit_interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews
    ADD CONSTRAINT employee_exit_interviews_pkey PRIMARY KEY (id);


--
-- TOC entry 6088 (class 2606 OID 18919)
-- Name: employee_exit_interviews employee_exit_interviews_resignation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews
    ADD CONSTRAINT employee_exit_interviews_resignation_id_key UNIQUE (resignation_id);


--
-- TOC entry 5832 (class 2606 OID 16612)
-- Name: employee_history employee_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history
    ADD CONSTRAINT employee_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6076 (class 2606 OID 18828)
-- Name: employee_invitation_tasks employee_invitation_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitation_tasks
    ADD CONSTRAINT employee_invitation_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 6072 (class 2606 OID 18803)
-- Name: employee_invitations employee_invitations_invitation_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitations
    ADD CONSTRAINT employee_invitations_invitation_token_key UNIQUE (invitation_token);


--
-- TOC entry 6074 (class 2606 OID 18801)
-- Name: employee_invitations employee_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitations
    ADD CONSTRAINT employee_invitations_pkey PRIMARY KEY (id);


--
-- TOC entry 6038 (class 2606 OID 18486)
-- Name: employee_login_security employee_login_security_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_login_security
    ADD CONSTRAINT employee_login_security_pkey PRIMARY KEY (id);


--
-- TOC entry 6040 (class 2606 OID 18488)
-- Name: employee_login_security employee_login_security_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_login_security
    ADD CONSTRAINT employee_login_security_user_id_key UNIQUE (user_id);


--
-- TOC entry 6060 (class 2606 OID 18667)
-- Name: employee_notes employee_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_notes
    ADD CONSTRAINT employee_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 6024 (class 2606 OID 18391)
-- Name: employee_policy_acknowledgments employee_policy_acknowledgments_employee_id_policy_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_policy_acknowledgments
    ADD CONSTRAINT employee_policy_acknowledgments_employee_id_policy_id_key UNIQUE (employee_id, policy_id);


--
-- TOC entry 6026 (class 2606 OID 18389)
-- Name: employee_policy_acknowledgments employee_policy_acknowledgments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_policy_acknowledgments
    ADD CONSTRAINT employee_policy_acknowledgments_pkey PRIMARY KEY (id);


--
-- TOC entry 6084 (class 2606 OID 18893)
-- Name: employee_profile_history employee_profile_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile_history
    ADD CONSTRAINT employee_profile_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6062 (class 2606 OID 18691)
-- Name: employee_reporting_history employee_reporting_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_reporting_history
    ADD CONSTRAINT employee_reporting_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6078 (class 2606 OID 18845)
-- Name: employee_search_history employee_search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_search_history
    ADD CONSTRAINT employee_search_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5974 (class 2606 OID 17989)
-- Name: employee_status_history employee_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status_history
    ADD CONSTRAINT employee_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5948 (class 2606 OID 17701)
-- Name: employee_transfers employee_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_pkey PRIMARY KEY (id);


--
-- TOC entry 5984 (class 2606 OID 18055)
-- Name: employee_work_anniversaries employee_work_anniversaries_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_anniversaries
    ADD CONSTRAINT employee_work_anniversaries_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5986 (class 2606 OID 18053)
-- Name: employee_work_anniversaries employee_work_anniversaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_anniversaries
    ADD CONSTRAINT employee_work_anniversaries_pkey PRIMARY KEY (id);


--
-- TOC entry 6064 (class 2606 OID 18715)
-- Name: employee_work_locations employee_work_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_locations
    ADD CONSTRAINT employee_work_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 5822 (class 2606 OID 16563)
-- Name: employees employees_employee_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_code_key UNIQUE (employee_code);


--
-- TOC entry 5824 (class 2606 OID 16559)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 5826 (class 2606 OID 16561)
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- TOC entry 6066 (class 2606 OID 18742)
-- Name: employment_types employment_types_company_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_types
    ADD CONSTRAINT employment_types_company_id_name_key UNIQUE (company_id, name);


--
-- TOC entry 6068 (class 2606 OID 18740)
-- Name: employment_types employment_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_types
    ADD CONSTRAINT employment_types_pkey PRIMARY KEY (id);


--
-- TOC entry 5890 (class 2606 OID 17203)
-- Name: exit_clearance exit_clearance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_clearance
    ADD CONSTRAINT exit_clearance_pkey PRIMARY KEY (id);


--
-- TOC entry 6020 (class 2606 OID 18344)
-- Name: expense_approval_history expense_approval_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_approval_history
    ADD CONSTRAINT expense_approval_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5870 (class 2606 OID 16975)
-- Name: expense_categories expense_categories_company_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_company_id_name_key UNIQUE (company_id, name);


--
-- TOC entry 5872 (class 2606 OID 16973)
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5874 (class 2606 OID 17002)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 6090 (class 2606 OID 18957)
-- Name: final_settlements final_settlements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements
    ADD CONSTRAINT final_settlements_pkey PRIMARY KEY (id);


--
-- TOC entry 6092 (class 2606 OID 18959)
-- Name: final_settlements final_settlements_resignation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements
    ADD CONSTRAINT final_settlements_resignation_id_key UNIQUE (resignation_id);


--
-- TOC entry 5850 (class 2606 OID 16787)
-- Name: holidays holidays_company_id_holiday_date_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_company_id_holiday_date_name_key UNIQUE (company_id, holiday_date, name);


--
-- TOC entry 5852 (class 2606 OID 16785)
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- TOC entry 5954 (class 2606 OID 17820)
-- Name: hr_messages hr_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_messages
    ADD CONSTRAINT hr_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5950 (class 2606 OID 17767)
-- Name: hr_policies hr_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_policies
    ADD CONSTRAINT hr_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 6018 (class 2606 OID 18319)
-- Name: leave_approval_history leave_approval_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approval_history
    ADD CONSTRAINT leave_approval_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6052 (class 2606 OID 18586)
-- Name: leave_calendar leave_calendar_employee_id_calendar_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar
    ADD CONSTRAINT leave_calendar_employee_id_calendar_date_key UNIQUE (employee_id, calendar_date);


--
-- TOC entry 6054 (class 2606 OID 18584)
-- Name: leave_calendar leave_calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar
    ADD CONSTRAINT leave_calendar_pkey PRIMARY KEY (id);


--
-- TOC entry 5962 (class 2606 OID 17916)
-- Name: leave_carry_forward leave_carry_forward_employee_id_leave_type_id_from_year_to__key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_carry_forward
    ADD CONSTRAINT leave_carry_forward_employee_id_leave_type_id_from_year_to__key UNIQUE (employee_id, leave_type_id, from_year, to_year);


--
-- TOC entry 5964 (class 2606 OID 17914)
-- Name: leave_carry_forward leave_carry_forward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_carry_forward
    ADD CONSTRAINT leave_carry_forward_pkey PRIMARY KEY (id);


--
-- TOC entry 5844 (class 2606 OID 16722)
-- Name: leave_policies leave_policies_company_id_leave_type_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_company_id_leave_type_id_key UNIQUE (company_id, leave_type_id);


--
-- TOC entry 5846 (class 2606 OID 16720)
-- Name: leave_policies leave_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 6042 (class 2606 OID 18506)
-- Name: leave_policy_acknowledgments leave_policy_acknowledgments_employee_id_leave_policy_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policy_acknowledgments
    ADD CONSTRAINT leave_policy_acknowledgments_employee_id_leave_policy_id_key UNIQUE (employee_id, leave_policy_id);


--
-- TOC entry 6044 (class 2606 OID 18504)
-- Name: leave_policy_acknowledgments leave_policy_acknowledgments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policy_acknowledgments
    ADD CONSTRAINT leave_policy_acknowledgments_pkey PRIMARY KEY (id);


--
-- TOC entry 5848 (class 2606 OID 16753)
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5924 (class 2606 OID 17549)
-- Name: leave_supporting_documents leave_supporting_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_supporting_documents
    ADD CONSTRAINT leave_supporting_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5840 (class 2606 OID 16698)
-- Name: leave_types leave_types_company_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_company_id_name_key UNIQUE (company_id, name);


--
-- TOC entry 5842 (class 2606 OID 16696)
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- TOC entry 5918 (class 2606 OID 17489)
-- Name: login_history login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5934 (class 2606 OID 17606)
-- Name: notification_settings notification_settings_company_id_notification_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_company_id_notification_type_key UNIQUE (company_id, notification_type);


--
-- TOC entry 5936 (class 2606 OID 17604)
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5908 (class 2606 OID 17433)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5892 (class 2606 OID 17234)
-- Name: offboarding offboarding_clearance_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_clearance_id_key UNIQUE (clearance_id);


--
-- TOC entry 5894 (class 2606 OID 17230)
-- Name: offboarding offboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_pkey PRIMARY KEY (id);


--
-- TOC entry 5896 (class 2606 OID 17232)
-- Name: offboarding offboarding_resignation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_resignation_id_key UNIQUE (resignation_id);


--
-- TOC entry 5882 (class 2606 OID 17088)
-- Name: onboarding onboarding_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5884 (class 2606 OID 17086)
-- Name: onboarding onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_pkey PRIMARY KEY (id);


--
-- TOC entry 5886 (class 2606 OID 17118)
-- Name: onboarding_tasks onboarding_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_tasks
    ADD CONSTRAINT onboarding_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 6036 (class 2606 OID 18467)
-- Name: password_history password_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5910 (class 2606 OID 17450)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 5912 (class 2606 OID 17452)
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- TOC entry 5864 (class 2606 OID 16926)
-- Name: payroll payroll_employee_id_payroll_month_payroll_year_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_employee_id_payroll_month_payroll_year_key UNIQUE (employee_id, payroll_month, payroll_year);


--
-- TOC entry 5868 (class 2606 OID 16952)
-- Name: payroll_items payroll_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_items
    ADD CONSTRAINT payroll_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5866 (class 2606 OID 16924)
-- Name: payroll payroll_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_pkey PRIMARY KEY (id);


--
-- TOC entry 6010 (class 2606 OID 18270)
-- Name: payroll_tax_details payroll_tax_details_payroll_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_tax_details
    ADD CONSTRAINT payroll_tax_details_payroll_id_key UNIQUE (payroll_id);


--
-- TOC entry 6012 (class 2606 OID 18268)
-- Name: payroll_tax_details payroll_tax_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_tax_details
    ADD CONSTRAINT payroll_tax_details_pkey PRIMARY KEY (id);


--
-- TOC entry 5966 (class 2606 OID 17942)
-- Name: payslips payslips_payroll_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_payroll_id_key UNIQUE (payroll_id);


--
-- TOC entry 5968 (class 2606 OID 17944)
-- Name: payslips payslips_payslip_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_payslip_number_key UNIQUE (payslip_number);


--
-- TOC entry 5970 (class 2606 OID 17940)
-- Name: payslips payslips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_pkey PRIMARY KEY (id);


--
-- TOC entry 5898 (class 2606 OID 17274)
-- Name: performance_cycles performance_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_cycles
    ADD CONSTRAINT performance_cycles_pkey PRIMARY KEY (id);


--
-- TOC entry 5904 (class 2606 OID 17368)
-- Name: performance_feedback performance_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_feedback
    ADD CONSTRAINT performance_feedback_pkey PRIMARY KEY (id);


--
-- TOC entry 6056 (class 2606 OID 18614)
-- Name: performance_goal_history performance_goal_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_history
    ADD CONSTRAINT performance_goal_history_pkey PRIMARY KEY (id);


--
-- TOC entry 6058 (class 2606 OID 18646)
-- Name: performance_goal_kpis performance_goal_kpis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_kpis
    ADD CONSTRAINT performance_goal_kpis_pkey PRIMARY KEY (id);


--
-- TOC entry 5900 (class 2606 OID 17303)
-- Name: performance_goals performance_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goals
    ADD CONSTRAINT performance_goals_pkey PRIMARY KEY (id);


--
-- TOC entry 6000 (class 2606 OID 18184)
-- Name: performance_history performance_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_history
    ADD CONSTRAINT performance_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5902 (class 2606 OID 17337)
-- Name: performance_reviews performance_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5944 (class 2606 OID 17676)
-- Name: permission_configuration permission_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_configuration
    ADD CONSTRAINT permission_configuration_pkey PRIMARY KEY (id);


--
-- TOC entry 5946 (class 2606 OID 17678)
-- Name: permission_configuration permission_configuration_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_configuration
    ADD CONSTRAINT permission_configuration_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- TOC entry 5798 (class 2606 OID 16416)
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- TOC entry 5800 (class 2606 OID 16414)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 6032 (class 2606 OID 18451)
-- Name: regional_holidays regional_holidays_holiday_id_region_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regional_holidays
    ADD CONSTRAINT regional_holidays_holiday_id_region_key UNIQUE (holiday_id, region);


--
-- TOC entry 6034 (class 2606 OID 18449)
-- Name: regional_holidays regional_holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regional_holidays
    ADD CONSTRAINT regional_holidays_pkey PRIMARY KEY (id);


--
-- TOC entry 6030 (class 2606 OID 18433)
-- Name: report_exports report_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_pkey PRIMARY KEY (id);


--
-- TOC entry 5888 (class 2606 OID 17144)
-- Name: resignations resignations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resignations
    ADD CONSTRAINT resignations_pkey PRIMARY KEY (id);


--
-- TOC entry 5940 (class 2606 OID 17656)
-- Name: role_configuration role_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_configuration
    ADD CONSTRAINT role_configuration_pkey PRIMARY KEY (id);


--
-- TOC entry 5942 (class 2606 OID 17658)
-- Name: role_configuration role_configuration_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_configuration
    ADD CONSTRAINT role_configuration_role_id_key UNIQUE (role_id);


--
-- TOC entry 5802 (class 2606 OID 16423)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- TOC entry 5794 (class 2606 OID 16402)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 5796 (class 2606 OID 16400)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5860 (class 2606 OID 16864)
-- Name: salary_components salary_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT salary_components_pkey PRIMARY KEY (id);


--
-- TOC entry 5862 (class 2606 OID 16884)
-- Name: salary_revisions salary_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_revisions
    ADD CONSTRAINT salary_revisions_pkey PRIMARY KEY (id);


--
-- TOC entry 5858 (class 2606 OID 16838)
-- Name: salary_structures salary_structures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structures
    ADD CONSTRAINT salary_structures_pkey PRIMARY KEY (id);


--
-- TOC entry 5834 (class 2606 OID 16639)
-- Name: shifts shifts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);


--
-- TOC entry 6028 (class 2606 OID 18413)
-- Name: system_activity_logs system_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_activity_logs
    ADD CONSTRAINT system_activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5930 (class 2606 OID 17588)
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5932 (class 2606 OID 17590)
-- Name: system_settings system_settings_setting_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_setting_name_key UNIQUE (setting_name);


--
-- TOC entry 5820 (class 2606 OID 16535)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- TOC entry 5804 (class 2606 OID 16450)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5806 (class 2606 OID 16448)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5854 (class 2606 OID 16807)
-- Name: weekly_offs weekly_offs_company_id_day_of_week_branch_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_offs
    ADD CONSTRAINT weekly_offs_company_id_day_of_week_branch_id_key UNIQUE (company_id, day_of_week, branch_id);


--
-- TOC entry 5856 (class 2606 OID 16805)
-- Name: weekly_offs weekly_offs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_offs
    ADD CONSTRAINT weekly_offs_pkey PRIMARY KEY (id);


--
-- TOC entry 5827 (class 1259 OID 19000)
-- Name: idx_employees_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_company_id ON public.employees USING btree (company_id);


--
-- TOC entry 5828 (class 1259 OID 19001)
-- Name: idx_employees_department_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_department_id ON public.employees USING btree (department_id);


--
-- TOC entry 5829 (class 1259 OID 19002)
-- Name: idx_employees_designation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_designation_id ON public.employees USING btree (designation_id);


--
-- TOC entry 5830 (class 1259 OID 19003)
-- Name: idx_employees_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_user_id ON public.employees USING btree (user_id);


--
-- TOC entry 6222 (class 2606 OID 18214)
-- Name: announcement_recipients announcement_recipients_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;


--
-- TOC entry 6223 (class 2606 OID 18219)
-- Name: announcement_recipients announcement_recipients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6161 (class 2606 OID 17404)
-- Name: announcements announcements_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6162 (class 2606 OID 17409)
-- Name: announcements announcements_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 6163 (class 2606 OID 17414)
-- Name: announcements announcements_published_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_published_by_fkey FOREIGN KEY (published_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 6217 (class 2606 OID 18160)
-- Name: approval_actions approval_actions_approval_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_actions
    ADD CONSTRAINT approval_actions_approval_request_id_fkey FOREIGN KEY (approval_request_id) REFERENCES public.approval_requests(id) ON DELETE CASCADE;


--
-- TOC entry 6218 (class 2606 OID 18165)
-- Name: approval_actions approval_actions_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_actions
    ADD CONSTRAINT approval_actions_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6215 (class 2606 OID 18137)
-- Name: approval_requests approval_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT approval_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6216 (class 2606 OID 18132)
-- Name: approval_requests approval_requests_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_requests
    ADD CONSTRAINT approval_requests_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.approval_workflows(id) ON DELETE CASCADE;


--
-- TOC entry 6213 (class 2606 OID 18111)
-- Name: approval_workflow_steps approval_workflow_steps_approver_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_approver_role_id_fkey FOREIGN KEY (approver_role_id) REFERENCES public.roles(id) ON DELETE RESTRICT;


--
-- TOC entry 6214 (class 2606 OID 18106)
-- Name: approval_workflow_steps approval_workflow_steps_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.approval_workflows(id) ON DELETE CASCADE;


--
-- TOC entry 6210 (class 2606 OID 18076)
-- Name: approval_workflows approval_workflows_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6211 (class 2606 OID 18081)
-- Name: approval_workflows approval_workflows_first_approver_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_first_approver_role_id_fkey FOREIGN KEY (first_approver_role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- TOC entry 6212 (class 2606 OID 18086)
-- Name: approval_workflows approval_workflows_second_approver_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_second_approver_role_id_fkey FOREIGN KEY (second_approver_role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- TOC entry 6194 (class 2606 OID 17855)
-- Name: assets assets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- TOC entry 6195 (class 2606 OID 17850)
-- Name: assets assets_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6247 (class 2606 OID 18561)
-- Name: attendance_calendar attendance_calendar_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_calendar
    ADD CONSTRAINT attendance_calendar_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6248 (class 2606 OID 18566)
-- Name: attendance_calendar attendance_calendar_holiday_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_calendar
    ADD CONSTRAINT attendance_calendar_holiday_id_fkey FOREIGN KEY (holiday_id) REFERENCES public.holidays(id) ON DELETE SET NULL;


--
-- TOC entry 6196 (class 2606 OID 17886)
-- Name: attendance_corrections attendance_corrections_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_corrections
    ADD CONSTRAINT attendance_corrections_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6197 (class 2606 OID 17876)
-- Name: attendance_corrections attendance_corrections_attendance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_corrections
    ADD CONSTRAINT attendance_corrections_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(id) ON DELETE CASCADE;


--
-- TOC entry 6198 (class 2606 OID 17881)
-- Name: attendance_corrections attendance_corrections_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_corrections
    ADD CONSTRAINT attendance_corrections_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6111 (class 2606 OID 16669)
-- Name: attendance attendance_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6169 (class 2606 OID 17531)
-- Name: attendance_rules attendance_rules_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_rules
    ADD CONSTRAINT attendance_rules_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6112 (class 2606 OID 16674)
-- Name: attendance attendance_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id) ON DELETE SET NULL;


--
-- TOC entry 6244 (class 2606 OID 18531)
-- Name: attendance_status_history attendance_status_history_attendance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_status_history
    ADD CONSTRAINT attendance_status_history_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(id) ON DELETE CASCADE;


--
-- TOC entry 6245 (class 2606 OID 18541)
-- Name: attendance_status_history attendance_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_status_history
    ADD CONSTRAINT attendance_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6246 (class 2606 OID 18536)
-- Name: attendance_status_history attendance_status_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_status_history
    ADD CONSTRAINT attendance_status_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6168 (class 2606 OID 17507)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6099 (class 2606 OID 16518)
-- Name: branches branches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6224 (class 2606 OID 18243)
-- Name: company_event_participants company_event_participants_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_event_participants
    ADD CONSTRAINT company_event_participants_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6225 (class 2606 OID 18238)
-- Name: company_event_participants company_event_participants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_event_participants
    ADD CONSTRAINT company_event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.company_events(id) ON DELETE CASCADE;


--
-- TOC entry 6190 (class 2606 OID 17795)
-- Name: company_events company_events_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_events
    ADD CONSTRAINT company_events_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6191 (class 2606 OID 17800)
-- Name: company_events company_events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_events
    ADD CONSTRAINT company_events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6171 (class 2606 OID 17571)
-- Name: company_settings company_settings_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6206 (class 2606 OID 18013)
-- Name: department_holidays department_holidays_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_holidays
    ADD CONSTRAINT department_holidays_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;


--
-- TOC entry 6207 (class 2606 OID 18018)
-- Name: department_holidays department_holidays_holiday_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_holidays
    ADD CONSTRAINT department_holidays_holiday_id_fkey FOREIGN KEY (holiday_id) REFERENCES public.holidays(id) ON DELETE CASCADE;


--
-- TOC entry 6098 (class 2606 OID 16486)
-- Name: departments departments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6233 (class 2606 OID 18369)
-- Name: document_activity_logs document_activity_logs_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_activity_logs
    ADD CONSTRAINT document_activity_logs_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- TOC entry 6234 (class 2606 OID 18374)
-- Name: document_activity_logs document_activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_activity_logs
    ADD CONSTRAINT document_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6133 (class 2606 OID 17035)
-- Name: document_categories document_categories_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6173 (class 2606 OID 17626)
-- Name: document_settings document_settings_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_settings
    ADD CONSTRAINT document_settings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6174 (class 2606 OID 17631)
-- Name: document_settings document_settings_document_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_settings
    ADD CONSTRAINT document_settings_document_category_id_fkey FOREIGN KEY (document_category_id) REFERENCES public.document_categories(id) ON DELETE SET NULL;


--
-- TOC entry 6134 (class 2606 OID 17063)
-- Name: documents documents_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.document_categories(id) ON DELETE RESTRICT;


--
-- TOC entry 6135 (class 2606 OID 17058)
-- Name: documents documents_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6136 (class 2606 OID 17068)
-- Name: documents documents_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6166 (class 2606 OID 17472)
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6227 (class 2606 OID 18300)
-- Name: employee_assets employee_assets_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assets
    ADD CONSTRAINT employee_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- TOC entry 6228 (class 2606 OID 18295)
-- Name: employee_assets employee_assets_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assets
    ADD CONSTRAINT employee_assets_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6283 (class 2606 OID 18993)
-- Name: employee_bank_accounts employee_bank_accounts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_bank_accounts
    ADD CONSTRAINT employee_bank_accounts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6208 (class 2606 OID 18037)
-- Name: employee_birthdays employee_birthdays_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_birthdays
    ADD CONSTRAINT employee_birthdays_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6272 (class 2606 OID 18866)
-- Name: employee_documents_access employee_documents_access_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access
    ADD CONSTRAINT employee_documents_access_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- TOC entry 6273 (class 2606 OID 18876)
-- Name: employee_documents_access employee_documents_access_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access
    ADD CONSTRAINT employee_documents_access_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6274 (class 2606 OID 18871)
-- Name: employee_documents_access employee_documents_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents_access
    ADD CONSTRAINT employee_documents_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6203 (class 2606 OID 17971)
-- Name: employee_emergency_contacts employee_emergency_contacts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_emergency_contacts
    ADD CONSTRAINT employee_emergency_contacts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6263 (class 2606 OID 18782)
-- Name: employee_employment_history employee_employment_history_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- TOC entry 6264 (class 2606 OID 18777)
-- Name: employee_employment_history employee_employment_history_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 6265 (class 2606 OID 18772)
-- Name: employee_employment_history employee_employment_history_designation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_designation_id_fkey FOREIGN KEY (designation_id) REFERENCES public.designations(id) ON DELETE SET NULL;


--
-- TOC entry 6266 (class 2606 OID 18762)
-- Name: employee_employment_history employee_employment_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6267 (class 2606 OID 18767)
-- Name: employee_employment_history employee_employment_history_employment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_employment_history
    ADD CONSTRAINT employee_employment_history_employment_type_id_fkey FOREIGN KEY (employment_type_id) REFERENCES public.employment_types(id) ON DELETE SET NULL;


--
-- TOC entry 6277 (class 2606 OID 18930)
-- Name: employee_exit_interviews employee_exit_interviews_conducted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews
    ADD CONSTRAINT employee_exit_interviews_conducted_by_fkey FOREIGN KEY (conducted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6278 (class 2606 OID 18920)
-- Name: employee_exit_interviews employee_exit_interviews_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews
    ADD CONSTRAINT employee_exit_interviews_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6279 (class 2606 OID 18925)
-- Name: employee_exit_interviews employee_exit_interviews_resignation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exit_interviews
    ADD CONSTRAINT employee_exit_interviews_resignation_id_fkey FOREIGN KEY (resignation_id) REFERENCES public.resignations(id) ON DELETE CASCADE;


--
-- TOC entry 6108 (class 2606 OID 16618)
-- Name: employee_history employee_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history
    ADD CONSTRAINT employee_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- TOC entry 6109 (class 2606 OID 16613)
-- Name: employee_history employee_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history
    ADD CONSTRAINT employee_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6270 (class 2606 OID 18829)
-- Name: employee_invitation_tasks employee_invitation_tasks_invitation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitation_tasks
    ADD CONSTRAINT employee_invitation_tasks_invitation_id_fkey FOREIGN KEY (invitation_id) REFERENCES public.employee_invitations(id) ON DELETE CASCADE;


--
-- TOC entry 6268 (class 2606 OID 18804)
-- Name: employee_invitations employee_invitations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitations
    ADD CONSTRAINT employee_invitations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6269 (class 2606 OID 18809)
-- Name: employee_invitations employee_invitations_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_invitations
    ADD CONSTRAINT employee_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 6241 (class 2606 OID 18489)
-- Name: employee_login_security employee_login_security_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_login_security
    ADD CONSTRAINT employee_login_security_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6256 (class 2606 OID 18673)
-- Name: employee_notes employee_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_notes
    ADD CONSTRAINT employee_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6257 (class 2606 OID 18668)
-- Name: employee_notes employee_notes_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_notes
    ADD CONSTRAINT employee_notes_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6235 (class 2606 OID 18392)
-- Name: employee_policy_acknowledgments employee_policy_acknowledgments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_policy_acknowledgments
    ADD CONSTRAINT employee_policy_acknowledgments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6236 (class 2606 OID 18397)
-- Name: employee_policy_acknowledgments employee_policy_acknowledgments_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_policy_acknowledgments
    ADD CONSTRAINT employee_policy_acknowledgments_policy_id_fkey FOREIGN KEY (policy_id) REFERENCES public.hr_policies(id) ON DELETE CASCADE;


--
-- TOC entry 6275 (class 2606 OID 18899)
-- Name: employee_profile_history employee_profile_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile_history
    ADD CONSTRAINT employee_profile_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6276 (class 2606 OID 18894)
-- Name: employee_profile_history employee_profile_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profile_history
    ADD CONSTRAINT employee_profile_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6258 (class 2606 OID 18692)
-- Name: employee_reporting_history employee_reporting_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_reporting_history
    ADD CONSTRAINT employee_reporting_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6259 (class 2606 OID 18697)
-- Name: employee_reporting_history employee_reporting_history_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_reporting_history
    ADD CONSTRAINT employee_reporting_history_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- TOC entry 6271 (class 2606 OID 18846)
-- Name: employee_search_history employee_search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_search_history
    ADD CONSTRAINT employee_search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6204 (class 2606 OID 17995)
-- Name: employee_status_history employee_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status_history
    ADD CONSTRAINT employee_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6205 (class 2606 OID 17990)
-- Name: employee_status_history employee_status_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_status_history
    ADD CONSTRAINT employee_status_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6178 (class 2606 OID 17747)
-- Name: employee_transfers employee_transfers_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6179 (class 2606 OID 17702)
-- Name: employee_transfers employee_transfers_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6180 (class 2606 OID 17727)
-- Name: employee_transfers employee_transfers_from_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_from_branch_id_fkey FOREIGN KEY (from_branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- TOC entry 6181 (class 2606 OID 17707)
-- Name: employee_transfers employee_transfers_from_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_from_department_id_fkey FOREIGN KEY (from_department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 6182 (class 2606 OID 17717)
-- Name: employee_transfers employee_transfers_from_designation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_from_designation_id_fkey FOREIGN KEY (from_designation_id) REFERENCES public.designations(id) ON DELETE SET NULL;


--
-- TOC entry 6183 (class 2606 OID 17737)
-- Name: employee_transfers employee_transfers_from_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_from_team_id_fkey FOREIGN KEY (from_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- TOC entry 6184 (class 2606 OID 17732)
-- Name: employee_transfers employee_transfers_to_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_to_branch_id_fkey FOREIGN KEY (to_branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- TOC entry 6185 (class 2606 OID 17712)
-- Name: employee_transfers employee_transfers_to_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_to_department_id_fkey FOREIGN KEY (to_department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 6186 (class 2606 OID 17722)
-- Name: employee_transfers employee_transfers_to_designation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_to_designation_id_fkey FOREIGN KEY (to_designation_id) REFERENCES public.designations(id) ON DELETE SET NULL;


--
-- TOC entry 6187 (class 2606 OID 17742)
-- Name: employee_transfers employee_transfers_to_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_transfers
    ADD CONSTRAINT employee_transfers_to_team_id_fkey FOREIGN KEY (to_team_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- TOC entry 6209 (class 2606 OID 18056)
-- Name: employee_work_anniversaries employee_work_anniversaries_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_anniversaries
    ADD CONSTRAINT employee_work_anniversaries_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6260 (class 2606 OID 18721)
-- Name: employee_work_locations employee_work_locations_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_locations
    ADD CONSTRAINT employee_work_locations_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- TOC entry 6261 (class 2606 OID 18716)
-- Name: employee_work_locations employee_work_locations_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_work_locations
    ADD CONSTRAINT employee_work_locations_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6101 (class 2606 OID 16584)
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- TOC entry 6102 (class 2606 OID 16569)
-- Name: employees employees_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 6103 (class 2606 OID 16574)
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- TOC entry 6104 (class 2606 OID 16579)
-- Name: employees employees_designation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_designation_id_fkey FOREIGN KEY (designation_id) REFERENCES public.designations(id);


--
-- TOC entry 6105 (class 2606 OID 16594)
-- Name: employees employees_reporting_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_reporting_manager_id_fkey FOREIGN KEY (reporting_manager_id) REFERENCES public.employees(id);


--
-- TOC entry 6106 (class 2606 OID 16589)
-- Name: employees employees_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- TOC entry 6107 (class 2606 OID 16564)
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 6262 (class 2606 OID 18743)
-- Name: employment_types employment_types_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_types
    ADD CONSTRAINT employment_types_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6144 (class 2606 OID 17209)
-- Name: exit_clearance exit_clearance_cleared_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_clearance
    ADD CONSTRAINT exit_clearance_cleared_by_fkey FOREIGN KEY (cleared_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6145 (class 2606 OID 17204)
-- Name: exit_clearance exit_clearance_resignation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_clearance
    ADD CONSTRAINT exit_clearance_resignation_id_fkey FOREIGN KEY (resignation_id) REFERENCES public.resignations(id) ON DELETE CASCADE;


--
-- TOC entry 6231 (class 2606 OID 18350)
-- Name: expense_approval_history expense_approval_history_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_approval_history
    ADD CONSTRAINT expense_approval_history_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6232 (class 2606 OID 18345)
-- Name: expense_approval_history expense_approval_history_expense_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_approval_history
    ADD CONSTRAINT expense_approval_history_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE CASCADE;


--
-- TOC entry 6129 (class 2606 OID 16976)
-- Name: expense_categories expense_categories_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6130 (class 2606 OID 17013)
-- Name: expenses expenses_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6131 (class 2606 OID 17008)
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON DELETE RESTRICT;


--
-- TOC entry 6132 (class 2606 OID 17003)
-- Name: expenses expenses_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6280 (class 2606 OID 18960)
-- Name: final_settlements final_settlements_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements
    ADD CONSTRAINT final_settlements_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6281 (class 2606 OID 18970)
-- Name: final_settlements final_settlements_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements
    ADD CONSTRAINT final_settlements_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6282 (class 2606 OID 18965)
-- Name: final_settlements final_settlements_resignation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.final_settlements
    ADD CONSTRAINT final_settlements_resignation_id_fkey FOREIGN KEY (resignation_id) REFERENCES public.resignations(id) ON DELETE CASCADE;


--
-- TOC entry 6119 (class 2606 OID 16788)
-- Name: holidays holidays_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6192 (class 2606 OID 17826)
-- Name: hr_messages hr_messages_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_messages
    ADD CONSTRAINT hr_messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6193 (class 2606 OID 17821)
-- Name: hr_messages hr_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_messages
    ADD CONSTRAINT hr_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6188 (class 2606 OID 17768)
-- Name: hr_policies hr_policies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_policies
    ADD CONSTRAINT hr_policies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6189 (class 2606 OID 17773)
-- Name: hr_policies hr_policies_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_policies
    ADD CONSTRAINT hr_policies_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6229 (class 2606 OID 18325)
-- Name: leave_approval_history leave_approval_history_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approval_history
    ADD CONSTRAINT leave_approval_history_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6230 (class 2606 OID 18320)
-- Name: leave_approval_history leave_approval_history_leave_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approval_history
    ADD CONSTRAINT leave_approval_history_leave_request_id_fkey FOREIGN KEY (leave_request_id) REFERENCES public.leave_requests(id) ON DELETE CASCADE;


--
-- TOC entry 6249 (class 2606 OID 18587)
-- Name: leave_calendar leave_calendar_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar
    ADD CONSTRAINT leave_calendar_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6250 (class 2606 OID 18592)
-- Name: leave_calendar leave_calendar_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar
    ADD CONSTRAINT leave_calendar_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6251 (class 2606 OID 18597)
-- Name: leave_calendar leave_calendar_leave_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_calendar
    ADD CONSTRAINT leave_calendar_leave_request_id_fkey FOREIGN KEY (leave_request_id) REFERENCES public.leave_requests(id) ON DELETE CASCADE;


--
-- TOC entry 6199 (class 2606 OID 17917)
-- Name: leave_carry_forward leave_carry_forward_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_carry_forward
    ADD CONSTRAINT leave_carry_forward_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6200 (class 2606 OID 17922)
-- Name: leave_carry_forward leave_carry_forward_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_carry_forward
    ADD CONSTRAINT leave_carry_forward_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE CASCADE;


--
-- TOC entry 6114 (class 2606 OID 16723)
-- Name: leave_policies leave_policies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6115 (class 2606 OID 16728)
-- Name: leave_policies leave_policies_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE CASCADE;


--
-- TOC entry 6242 (class 2606 OID 18507)
-- Name: leave_policy_acknowledgments leave_policy_acknowledgments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policy_acknowledgments
    ADD CONSTRAINT leave_policy_acknowledgments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6243 (class 2606 OID 18512)
-- Name: leave_policy_acknowledgments leave_policy_acknowledgments_leave_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policy_acknowledgments
    ADD CONSTRAINT leave_policy_acknowledgments_leave_policy_id_fkey FOREIGN KEY (leave_policy_id) REFERENCES public.leave_policies(id) ON DELETE CASCADE;


--
-- TOC entry 6116 (class 2606 OID 16764)
-- Name: leave_requests leave_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6117 (class 2606 OID 16754)
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6118 (class 2606 OID 16759)
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE CASCADE;


--
-- TOC entry 6170 (class 2606 OID 17550)
-- Name: leave_supporting_documents leave_supporting_documents_leave_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_supporting_documents
    ADD CONSTRAINT leave_supporting_documents_leave_request_id_fkey FOREIGN KEY (leave_request_id) REFERENCES public.leave_requests(id) ON DELETE CASCADE;


--
-- TOC entry 6113 (class 2606 OID 16699)
-- Name: leave_types leave_types_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6167 (class 2606 OID 17490)
-- Name: login_history login_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6172 (class 2606 OID 17607)
-- Name: notification_settings notification_settings_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6164 (class 2606 OID 17434)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6146 (class 2606 OID 17245)
-- Name: offboarding offboarding_clearance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_clearance_id_fkey FOREIGN KEY (clearance_id) REFERENCES public.exit_clearance(id) ON DELETE SET NULL;


--
-- TOC entry 6147 (class 2606 OID 17250)
-- Name: offboarding offboarding_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6148 (class 2606 OID 17235)
-- Name: offboarding offboarding_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6149 (class 2606 OID 17240)
-- Name: offboarding offboarding_resignation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offboarding
    ADD CONSTRAINT offboarding_resignation_id_fkey FOREIGN KEY (resignation_id) REFERENCES public.resignations(id) ON DELETE CASCADE;


--
-- TOC entry 6137 (class 2606 OID 17094)
-- Name: onboarding onboarding_assigned_hr_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_assigned_hr_fkey FOREIGN KEY (assigned_hr) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6138 (class 2606 OID 17099)
-- Name: onboarding onboarding_assigned_manager_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_assigned_manager_fkey FOREIGN KEY (assigned_manager) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6139 (class 2606 OID 17089)
-- Name: onboarding onboarding_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6140 (class 2606 OID 17124)
-- Name: onboarding_tasks onboarding_tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_tasks
    ADD CONSTRAINT onboarding_tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6141 (class 2606 OID 17119)
-- Name: onboarding_tasks onboarding_tasks_onboarding_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_tasks
    ADD CONSTRAINT onboarding_tasks_onboarding_id_fkey FOREIGN KEY (onboarding_id) REFERENCES public.onboarding(id) ON DELETE CASCADE;


--
-- TOC entry 6240 (class 2606 OID 18468)
-- Name: password_history password_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_history
    ADD CONSTRAINT password_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6165 (class 2606 OID 17453)
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6126 (class 2606 OID 16927)
-- Name: payroll payroll_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6128 (class 2606 OID 16953)
-- Name: payroll_items payroll_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_items
    ADD CONSTRAINT payroll_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payroll(id) ON DELETE CASCADE;


--
-- TOC entry 6127 (class 2606 OID 16932)
-- Name: payroll payroll_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6226 (class 2606 OID 18271)
-- Name: payroll_tax_details payroll_tax_details_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_tax_details
    ADD CONSTRAINT payroll_tax_details_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payroll(id) ON DELETE CASCADE;


--
-- TOC entry 6201 (class 2606 OID 17950)
-- Name: payslips payslips_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6202 (class 2606 OID 17945)
-- Name: payslips payslips_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payroll(id) ON DELETE CASCADE;


--
-- TOC entry 6150 (class 2606 OID 17275)
-- Name: performance_cycles performance_cycles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_cycles
    ADD CONSTRAINT performance_cycles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6151 (class 2606 OID 17280)
-- Name: performance_cycles performance_cycles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_cycles
    ADD CONSTRAINT performance_cycles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6158 (class 2606 OID 17374)
-- Name: performance_feedback performance_feedback_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_feedback
    ADD CONSTRAINT performance_feedback_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.performance_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 6159 (class 2606 OID 17369)
-- Name: performance_feedback performance_feedback_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_feedback
    ADD CONSTRAINT performance_feedback_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6160 (class 2606 OID 17379)
-- Name: performance_feedback performance_feedback_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_feedback
    ADD CONSTRAINT performance_feedback_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6252 (class 2606 OID 18625)
-- Name: performance_goal_history performance_goal_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_history
    ADD CONSTRAINT performance_goal_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6253 (class 2606 OID 18620)
-- Name: performance_goal_history performance_goal_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_history
    ADD CONSTRAINT performance_goal_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6254 (class 2606 OID 18615)
-- Name: performance_goal_history performance_goal_history_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_history
    ADD CONSTRAINT performance_goal_history_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.performance_goals(id) ON DELETE CASCADE;


--
-- TOC entry 6255 (class 2606 OID 18647)
-- Name: performance_goal_kpis performance_goal_kpis_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goal_kpis
    ADD CONSTRAINT performance_goal_kpis_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.performance_goals(id) ON DELETE CASCADE;


--
-- TOC entry 6152 (class 2606 OID 17314)
-- Name: performance_goals performance_goals_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goals
    ADD CONSTRAINT performance_goals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6153 (class 2606 OID 17309)
-- Name: performance_goals performance_goals_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goals
    ADD CONSTRAINT performance_goals_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.performance_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 6154 (class 2606 OID 17304)
-- Name: performance_goals performance_goals_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_goals
    ADD CONSTRAINT performance_goals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6219 (class 2606 OID 18190)
-- Name: performance_history performance_history_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_history
    ADD CONSTRAINT performance_history_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.performance_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 6220 (class 2606 OID 18185)
-- Name: performance_history performance_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_history
    ADD CONSTRAINT performance_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6221 (class 2606 OID 18195)
-- Name: performance_history performance_history_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_history
    ADD CONSTRAINT performance_history_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.performance_reviews(id) ON DELETE SET NULL;


--
-- TOC entry 6155 (class 2606 OID 17343)
-- Name: performance_reviews performance_reviews_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.performance_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 6156 (class 2606 OID 17338)
-- Name: performance_reviews performance_reviews_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6157 (class 2606 OID 17348)
-- Name: performance_reviews performance_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6176 (class 2606 OID 17684)
-- Name: permission_configuration permission_configuration_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_configuration
    ADD CONSTRAINT permission_configuration_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- TOC entry 6177 (class 2606 OID 17679)
-- Name: permission_configuration permission_configuration_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_configuration
    ADD CONSTRAINT permission_configuration_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 6239 (class 2606 OID 18452)
-- Name: regional_holidays regional_holidays_holiday_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regional_holidays
    ADD CONSTRAINT regional_holidays_holiday_id_fkey FOREIGN KEY (holiday_id) REFERENCES public.holidays(id) ON DELETE CASCADE;


--
-- TOC entry 6238 (class 2606 OID 18434)
-- Name: report_exports report_exports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 6142 (class 2606 OID 17150)
-- Name: resignations resignations_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resignations
    ADD CONSTRAINT resignations_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6143 (class 2606 OID 17145)
-- Name: resignations resignations_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resignations
    ADD CONSTRAINT resignations_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6175 (class 2606 OID 17659)
-- Name: role_configuration role_configuration_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_configuration
    ADD CONSTRAINT role_configuration_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 6095 (class 2606 OID 16429)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- TOC entry 6096 (class 2606 OID 16424)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 6123 (class 2606 OID 16865)
-- Name: salary_components salary_components_salary_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT salary_components_salary_structure_id_fkey FOREIGN KEY (salary_structure_id) REFERENCES public.salary_structures(id) ON DELETE CASCADE;


--
-- TOC entry 6124 (class 2606 OID 16890)
-- Name: salary_revisions salary_revisions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_revisions
    ADD CONSTRAINT salary_revisions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6125 (class 2606 OID 16885)
-- Name: salary_revisions salary_revisions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_revisions
    ADD CONSTRAINT salary_revisions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6122 (class 2606 OID 16839)
-- Name: salary_structures salary_structures_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structures
    ADD CONSTRAINT salary_structures_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- TOC entry 6110 (class 2606 OID 16640)
-- Name: shifts shifts_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 6237 (class 2606 OID 18414)
-- Name: system_activity_logs system_activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_activity_logs
    ADD CONSTRAINT system_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 6100 (class 2606 OID 16536)
-- Name: teams teams_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;


--
-- TOC entry 6097 (class 2606 OID 16451)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 6120 (class 2606 OID 16813)
-- Name: weekly_offs weekly_offs_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_offs
    ADD CONSTRAINT weekly_offs_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- TOC entry 6121 (class 2606 OID 16808)
-- Name: weekly_offs weekly_offs_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_offs
    ADD CONSTRAINT weekly_offs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


-- Completed on 2026-08-11 15:19:42

--
-- PostgreSQL database dump complete
--

\unrestrict 5fyHPtimrFu9Uq8JbkbdnSjqb3bi4glXzbLdkr53Uz4opjbHyY7hEVtG15e02hB


